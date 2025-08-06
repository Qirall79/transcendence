import pyotp


def get_otp_code(user):
    otp_base32 = pyotp.random_base32()
    otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(
        name=user.username.lower(), issuer_name="transcendence"
    )
    user.otp_base32 = otp_base32
    user.otp_url = otp_auth_url


def verify_otp_code(user, code):
    totp = pyotp.TOTP(user.otp_base32)
    if not totp.verify(code):
        return False
    return True
