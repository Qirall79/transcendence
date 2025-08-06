from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from authentication.exceptions import UserAlreadyExistsException


@api_view(["GET"])
@permission_classes([AllowAny])
def sayHello(request):
    
    raise UserAlreadyExistsException()
    
    return Response({"message": "Hello from api"}, status=status.HTTP_200_OK)
