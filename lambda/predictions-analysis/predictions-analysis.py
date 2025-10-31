# Save as analyze_crowd_vs_books.py and run with python
import pandas as pd
import numpy as np
from scipy import stats
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
import math

# ------------- load data -------------
df = pd.read_csv("../../assets/testdata/2025-predictions-week1.csv")  # adjust filename
# If actuals appear only once per game, OK. If duplicated across predictors, grouping will be fine.

# ------------- aggregate crowd by game -------------
agg = df.groupby('gameId').agg(
    crowd_home = ('homeTeam.score', 'mean'),
    crowd_away = ('awayTeam.score', 'mean'),
    actual_home = ('results.awayTeam.score', 'first'),
    actual_away = ('results.homeTeam.score', 'first'),
    spread = ('game.spread', 'first'),
    over_under = ('game.total', 'first'),
    n_preds = ('userId', 'nunique'),
    preds_std_home = ('homeTeam.score', 'std'),
    preds_std_away = ('awayTeam.score', 'std')
).reset_index()


agg['crowd_margin'] = agg['crowd_home'] - agg['crowd_away']
agg['actual_margin'] = agg['actual_home'] - agg['actual_away']
agg['crowd_total'] = agg['crowd_home'] + agg['crowd_away']
agg['actual_total'] = agg['actual_home'] + agg['actual_away']
print ('agg[\'actual_home\'], agg[\'actual_away\']:', agg[['actual_home', 'actual_away']].head())
print('agg[\'crowd_home\'],agg[\'crowd_away\']:', agg[['crowd_home'], agg['crowd_away']].head())


print("Aggregated to game level, sample:")
print(agg.head())
print('crowd_margin stats:', agg['crowd_margin'].describe())
print('actual_margin stats:', agg['actual_margin'].describe())
print('spread stats:', agg['spread'].describe())
print('crowd_total stats:', agg['crowd_total'].describe())
print('actual_total stats:', agg['actual_total'].describe())

# Optional: normalize spread sign if your data uses opposite convention.
# Assume spread = positive means home favored by spread points. If not, multiply by -1.

# ------------- compute errors -------------
agg['err_crowd_margin'] = (agg['crowd_margin'] - agg['actual_margin']).abs()
agg['err_spread'] = (agg['spread'] - agg['actual_margin']).abs()

agg['err_crowd_total'] = (agg['crowd_total'] - agg['actual_total']).abs()
agg['err_over_under'] = (agg['over_under'] - agg['actual_total']).abs()

# ------------- summary metrics -------------
def summarize_errors(a, b, name_a='A', name_b='B'):
    print(f"---- {name_a} vs {name_b} ----")
    for label, series in [(name_a, a), (name_b, b)]:
        print(f"{label} MAE: {series.mean():.3f}, RMSE: {np.sqrt((series**2).mean()):.3f}, median AE: {series.median():.3f}")
    diff = a - b
    print(f"Mean difference (A - B): {diff.mean():.3f}, median diff: {diff.median():.3f}")
    # Paired t-test & Wilcoxon
    tstat, tp = stats.ttest_rel(a, b, nan_policy='omit')
    print(f"Paired t-test p={tp:.4f}, t={tstat:.3f}")
    try:
        wstat, wp = stats.wilcoxon(a, b)
        print(f"Wilcoxon signed-rank p={wp:.4f}, stat={wstat:.3f}")
    except Exception as e:
        print("Wilcoxon failed (maybe many ties):", e)
    # bootstrap 95% CI for mean difference
    diffs = []
    arr = diff.dropna().values
    for _ in range(2000):
        samp = np.random.choice(arr, size=len(arr), replace=True)
        diffs.append(samp.mean())
    lo, hi = np.percentile(diffs, [2.5, 97.5])
    print(f"Bootstrap 95% CI for mean(A-B): [{lo:.3f}, {hi:.3f}]")
    # effect size (Cohen's d)
    d = diff.mean() / diff.std(ddof=1) if diff.std(ddof=1) > 0 else np.nan
    print(f"Cohen's d for diff: {d:.3f}\n")

summarize_errors(agg['err_crowd_margin'], agg['err_spread'], 'crowd_margin', 'spread')
summarize_errors(agg['err_crowd_total'], agg['err_over_under'], 'crowd_total', 'over_under')

# ------------- winner accuracy -------------
agg['crowd_pick'] = np.sign(agg['crowd_margin']).replace({0:1})  # tie -> pick home arbitrarily
agg['actual_winner'] = np.sign(agg['actual_margin']).replace({0:1})
# For spread pick: if spread > 0 home favored, so market pick = sign(spread)
agg['spread_pick'] = np.sign(agg['spread']).replace({0:1})

print("Winner accuracy:")
print("crowd accuracy:", (agg['crowd_pick'] == agg['actual_winner']).mean())
print("spread accuracy:", (agg['spread_pick'] == agg['actual_winner']).mean())

# Paired McNemar: count where they disagree
from statsmodels.stats.contingency_tables import mcnemar
table = [[0,0],[0,0]]
# table: [[both correct, crowd correct only], [spread correct only, both wrong]]
for _, row in agg.iterrows():
    print('table[1][0]: ',table[1][0])
    crowd_ok = row['crowd_pick'] == row['actual_winner']
    spread_ok = row['spread_pick'] == row['actual_winner']
    if crowd_ok and spread_ok:
        table[0][0] += 1
    elif crowd_ok and not spread_ok:
        table[0][1] += 1
    elif (not crowd_ok) and spread_ok:
        table[1][0] += 1
    else:
        table[1][1] += 1
print("Contingency table (both, crowd-only, spread-only, neither):", table)
res = mcnemar(table, exact=False)
print("McNemar p-value:", res.pvalue)

# ------------- calibration & scatter -------------
print("Margin R^2 crowd:", r2_score(agg['actual_margin'], agg['crowd_margin']))
print("Margin R^2 spread:", r2_score(agg['actual_margin'], agg['spread']))

# simple scatter plot
plt.figure(figsize=(8,6))
plt.scatter(agg['crowd_margin'], agg['actual_margin'], alpha=0.6, label='crowd')
plt.scatter(agg['spread'], agg['actual_margin'], alpha=0.6, label='spread')
mx = max(plt.xlim()[1], plt.ylim()[1])
mn = min(plt.xlim()[0], plt.ylim()[0])
plt.plot([mn,mx],[mn,mx], '--', label='ideal')
plt.xlabel('Predicted margin'); plt.ylabel('Actual margin'); plt.legend(); plt.title('Predicted vs Actual margin')
plt.show()

# ------------- subgroup: close games -------------
close = agg[agg['spread'].abs() <= 3]
print("Close games count:", len(close))
if len(close) >= 10:
    summarize_errors(close['err_crowd_margin'], close['err_spread'], 'crowd_margin (close)', 'spread (close)')

# ------------- simple ensemble - OLS combining crowd & spread -------------
import statsmodels.api as sm
X = agg[['crowd_margin','spread']].copy()
X = sm.add_constant(X)
y = agg['actual_margin']
model = sm.OLS(y, X, missing='drop').fit()
print(model.summary())

# ------------- save summary -------------
agg.to_csv("agg_game_level_summary.csv", index=False)
print("Saved agg_game_level_summary.csv")
