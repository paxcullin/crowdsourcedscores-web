from typing import List, Union

from pysbr.queries.query import Query


@Query.typecheck
def _check_union_list(self, league_ids: Union[List[int], int]) -> None:
    # This exercises the typecheck decorator without making network calls.
    return None


def lambda_handler(event, context):
    _check_union_list(None, 20)
    _check_union_list(None, [20, 21])
    return {
        "ok": True,
        "message": "pysbr import and typecheck OK"
    }
