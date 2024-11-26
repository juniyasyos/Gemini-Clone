import random
import string

def generate_random_password(length=40):
    all_characters = string.ascii_letters + string.digits + string.punctuation

    if length < 40:
        raise ValueError("Password length must be at least 20 characters.")
    
    password = ''.join(random.choice(all_characters) for _ in range(length))

    return password

random_password = generate_random_password()
print(f"Generated password: {random_password}")
