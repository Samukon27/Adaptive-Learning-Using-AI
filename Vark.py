def vark_quiz():
    print("Welcome to the VARK Learning Style Quiz!")
    print("Answer each question with V, A, R, or K, based on your preferences.")

    questions = [
        "1. When learning a new skill, do you prefer to watch a demonstration (V), listen to instructions (A), read a manual (R), or try it yourself (K)?",
        "2. In a group discussion or lecture, do you remember information best when it is presented through visual aids (V), spoken words (A), written notes (R), or hands-on activities (K)?",
        "3. When studying for a test, do you find that you remember information best when you create diagrams or mind maps (V), repeat information out loud (A), read and highlight text (R), or act out the concepts (K)?",
        "4. In a new environment, do you navigate and remember directions best by using landmarks and visual cues (V), following verbal directions (A), reading a map or written instructions (R), or exploring and physically moving around (K)?",
    ]

    answers = []

    for question in questions:
        response = input(question + " ")
        answers.append(response.upper())

    v_count = answers.count("V")
    a_count = answers.count("A")
    r_count = answers.count("R")
    k_count = answers.count("K")

    max_count = max(v_count, a_count, r_count, k_count)

    if v_count == max_count:
        learning_style = "Visual"
    elif a_count == max_count:
        learning_style = "Auditory"
    elif r_count == max_count:
        learning_style = "Reading/Writing"
    else:
        learning_style = "Kinesthetic"

    print("\nYour dominant learning style is:", learning_style)


if _name_ == "_main_":
    vark_quiz()