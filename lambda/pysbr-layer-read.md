I’m checking the current package layout and Python path setup across the sport lambdas to identify every bundled `pysbr` copy that can override `/opt/python`. Then I’ll give you the concrete cleanup and deployment steps needed to make the layer the only source of truth.

Searched for files matching `crowdsourcedscores-web` · `lambda/pysbr-*/pysbr/**`, 100 matches

Searched for regex `sys\.path|PYTHONPATH|from pysbr|import pysbr` (`**/lambda/pysbr-*/lambda_function.py`), 33 results

Read , lines 1 to 80

Your sport functions are currently capable of importing bundled `pysbr` copies from `/var/task`, because both NFL and NCAAF explicitly move `/var/task` ahead of `/opt/python`. That defeats the shared layer.

To make the AWS layer the only source of `pysbr`:

1. Treat `pysbr` as the sole editable library. Do not update `pysbr` copies inside individual function folders.

2. Build each sport Lambda zip without a `pysbr/` directory. The deployment zip should contain `lambda_function.py` and only function-specific files.

3. In every sport handler, put `/opt/python` first and remove the `/var/task` reordering:
```python
if "/opt/python" in sys.path:
    sys.path.remove("/opt/python")
sys.path.insert(0, "/opt/python")
```
Remove this block from NFL/NCAAF:
```python
if "/var/task" in sys.path:
    sys.path.insert(0, sys.path.pop(sys.path.index("/var/task")))
```

4. Publish a new `pysbr-common` layer version, then attach that exact new ARN to every sport function:
```bash
aws lambda update-function-configuration \
  --function-name pysbr-nfl \
  --layers arn:aws:lambda:us-west-2:198282214908:layer:pysbr-common:<version>
```
Repeat for `pysbr-ncaaf`, `pysbr-ncaab`, and `pysbr-nba`.

5. Keep `PYTHONPATH=/opt/python:/var/task` configured for each function. Be careful: AWS’s `--environment Variables=...` replaces the whole environment-variable set, so preserve any existing variables when updating it.

For a one-time deployment check, log the resolved library location after imports:
```python
import pysbr
print("Loaded pysbr from:", pysbr.__file__)
```
CloudWatch should show `/opt/python/pysbr/__init__.py`. If it shows `/var/task/pysbr/...`, that function zip still contains a bundled copy or its path order is wrong.