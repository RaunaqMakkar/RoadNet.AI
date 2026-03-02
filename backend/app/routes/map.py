from fastapi import APIRouter

router = APIRouter(prefix="/map-data", tags=["Map"])


@router.get("/")
async def get_map_data():
    return {"message": "Map endpoint working"}
