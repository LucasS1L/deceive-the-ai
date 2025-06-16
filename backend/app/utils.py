CLASS_MAP = {
    "adidas": 0,
    "converse": 1,
    "nike": 2
}

def get_expected_class_from_filename(filename: str) -> int:
    for brand in CLASS_MAP:
        if filename.lower().startswith(brand):
            return CLASS_MAP[brand]
    raise ValueError(f"Classe não reconhecida no nome da imagem: {filename}")