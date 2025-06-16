import os
import numpy as np
import tensorflow as tf

model = tf.keras.models.load_model("model.keras")

image_dir = "static"

def predict_image_class(image_name: str) -> int:
    img_path = os.path.join(image_dir, image_name)
    if not os.path.exists(img_path):
        raise FileNotFoundError("Imagem não encontrada")

    img = tf.keras.preprocessing.image.load_img(img_path, target_size=(224, 224))  # ajuste ao input do modelo
    img_array = tf.keras.preprocessing.image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction[0])

    return int(predicted_class)


