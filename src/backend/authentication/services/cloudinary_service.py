import os
import cloudinary
import cloudinary.uploader
from core.utils import read_secret

cloudinary.config(
    cloud_name=read_secret('cloudinary-name', 'cloudinary_name'),
    api_key=read_secret('cloudinary-api-key', 'cloudinary_api_key'),
    api_secret=read_secret('cloudinary-api-secret', 'cloudinary_api_secret'),
)


def delete_image(url):
    if "cloudinary" not in url:
        return
    try:
        public_id = url.split("/")[-1].split(".")[0]
        response = cloudinary.uploader.destroy(public_id)
        return response
    except Exception as e:
        return {"error": str(e)}
