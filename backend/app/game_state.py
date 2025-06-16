# app/game_state.py
import os
import random

class GameState:
    def __init__(self):
        self.reset_game()

    def reset_game(self):
        self.is_initialized = False
        self.round = 1
        self.player_score = 0
        self.ai_score = 0
        self.max_score = 4
        self.image_dir = "static"
        self.available_images = self._get_images()
        self.used_images = set()
        self.current_images = self._sample_images()

    def _get_images(self):
        return [img for img in os.listdir(self.image_dir) if img.lower().endswith(('.jpg', '.png'))]

    def _sample_images(self, n=5):
        remaining_images = list(set(self.available_images) - self.used_images)
        if len(remaining_images) < n:
            raise ValueError("Não há imagens suficientes restantes para continuar a partida.")
        sampled = random.sample(remaining_images, n)
        self.used_images.update(sampled)
        return sampled

    def next_round(self):
        self.round += 1
        self.current_images = self._sample_images()

    def is_game_over(self):
        return self.player_score == self.max_score or self.ai_score == self.max_score

    def get_winner(self):
        if self.player_score == self.max_score:
            return "player"
        elif self.ai_score == self.max_score:
            return "ai"
        return None

# Instância global
game = GameState()