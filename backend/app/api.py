from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.prediction_model import predict_image_class
from app.game_state import game
from app.utils import get_expected_class_from_filename

router = APIRouter()

class ImageChoice(BaseModel):
    image_chosen: str

@router.get("/predict/{image_name}")
def predict(image_name: str):
    try:
        prediction = predict_image_class(image_name)
        return {"class": prediction}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Image not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/start-game")
def start_game():
    game.reset_game()
    game.is_initialized = True
    return {
        "round": game.round,
        "player_score": game.player_score,
        "ai_score": game.ai_score,
        "images": game.current_images
    }

@router.post("/play")
def play_round(image: ImageChoice):
    try:
        if not game.is_initialized:
            raise HTTPException(status_code=422, detail="The game hasn't started.")
        
        if game.is_game_over():
            raise HTTPException(status_code=422, detail="The game is over. You can't continue playing.")
        
        if image.image_chosen not in game.current_images:
           raise HTTPException(
               status_code=422,
               detail="The chosen image is not part of the current round's options."
           )
             
        expected_class = get_expected_class_from_filename(image.image_chosen)
        predicted_class = predict_image_class(image.image_chosen)

        if predicted_class == expected_class:
            game.ai_score += 1
            winner = "ai"
        else:
            game.player_score += 1
            winner = "player"

        game_over = game.is_game_over()
        game_winner = game.get_winner()

        game.next_round()

        return {
            "round": game.round,
            "image_chosen": image.image_chosen,
            "predicted_class": predicted_class,
            "expected_class": expected_class,
            "winner": winner,
            "player_score": game.player_score,
            "ai_score": game.ai_score,
            "game_over": game_over,
            "final_winner": game_winner,
            "images": game.current_images if not game_over else []
        }
    except HTTPException as e:
        raise e
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Image not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/state")
def get_game_state():
    return {
        "round": game.round,
        "player_score": game.player_score,
        "ai_score": game.ai_score,
        "game_over": game.is_game_over(),
        "winner": game.get_winner()
    }

@router.post("/reset")
def reset_game():
    game.reset_game()
    return {"message": "Game has been reset"}