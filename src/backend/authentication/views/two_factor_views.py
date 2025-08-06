import json
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from authentication import serializers
from authentication.services import user_service, auth_service, jwt_service
from authentication.utils import add_cookies
from authentication.permissions import IsAuthenticatedOrWriteOnly


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticatedOrWriteOnly])
def handle_2fa(request):
    if request.method == "POST":
        body = json.loads(request.body.decode("utf-8"))
        user = user_service.find_by_id(body["id"])
        code = int(body["code"])
        if not user or not auth_service.verify_otp_code(user, code):
            return Response({"error": "Invalid code: " + str(code)}, status=400)
        response = Response()
        tokens = jwt_service.get_tokens_for_user(user)
        add_cookies(response=response, tokens=tokens)
        serializer = serializers.UserSerializer(user)
        response.data = serializer.data
        response.status_code = 200
        return response

    if request.method == "GET":
        user = request.user
        response = Response()
        if not user.otp_url:
            auth_service.get_otp_code(user)
        response.data = {"url": user.otp_url}
        return response
