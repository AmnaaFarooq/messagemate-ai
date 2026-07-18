from app.models.schemas import Tone

SYSTEM_PROMPT = """You are an expert communication assistant.

Rewrite messages while preserving the original meaning.
Do not invent information.
Improve grammar.
Keep the tone requested by the user.
Return only the rewritten message."""

# Extra, tone-specific guidance appended to the user turn so the same system
# prompt (kept verbatim per spec) can drive nine distinct behaviours.
TONE_INSTRUCTIONS: dict[Tone, str] = {
    Tone.PROFESSIONAL: "Rewrite this message in a clear, professional tone suitable for a workplace.",
    Tone.FRIENDLY: "Rewrite this message in a warm, friendly, casual-but-polite tone.",
    Tone.FORMAL: "Rewrite this message in a formal tone, suitable for official correspondence.",
    Tone.BOSS: "Rewrite this message as if sending it to your boss or manager at work.",
    Tone.CLIENT: "Rewrite this message as if sending it to a client, staying courteous and professional.",
    Tone.SHORTER: "Rewrite this message to be significantly shorter and more concise, while keeping the meaning and a professional tone.",
    Tone.LONGER: "Rewrite this message to be more detailed and thorough, while keeping a professional tone.",
    Tone.MORE_POLITE: "Rewrite this message to sound more polite and considerate, while keeping a professional tone.",
    Tone.MORE_CONFIDENT: "Rewrite this message to sound more confident and direct, while keeping a professional tone.",
}


def build_user_prompt(text: str, tone: Tone) -> str:
    instruction = TONE_INSTRUCTIONS[tone]
    return f"{instruction}\n\nOriginal message:\n{text}"
