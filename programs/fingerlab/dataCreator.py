from uuid import uuid4
import random

def random_between(min_value, max_value):
    return random.randint(min_value, max_value)

def generate_entries(num_entries):
    names = [
        ("Müller", "Hans"), ("Meier", "Julia"), ("Smith", "John"), ("Brown", "Emily"),
        ("Dupont", "Marie"), ("Rossi", "Luca"), ("Ivanov", "Ivan"), ("Wang", "Li"),
        ("Kim", "Min-jun"), ("García", "Sofía"),
        ("Johansson", "Erik"), ("Santos", "Lucas"), ("Kumar", "Ananya"), ("Levi", "Noah"),
        ("O'Connor", "Fiona"), ("Silva", "Gabriela"), ("Zhang", "Wei"), ("Nakamura", "Yuto"),
        ("Kovács", "Márk"), ("Abdi", "Hassan"),
        ("Chen", "Ming"), ("Diallo", "Aïssa"), ("Ibrahim", "Mohamed"), ("Smith", "Angela"),
        ("Bernard", "Claire"), ("Petrov", "Alexei"), ("Hansen", "Lars"), ("López", "Carmen"),
        ("Gupta", "Priya"), ("Ahmed", "Sami"),
        ("Kazinsky", "Tadeusz"), ("Johnson", "Olivia"), ("Martinez", "Jose"), ("Novak", "Jiri"),
        ("Khan", "Zara"), ("Yilmaz", "Ahmet"), ("Li", "Qiang"), ("Suzuki", "Haruto"),
        ("Dubois", "René"), ("O'Reilly", "Sean"),
        ("Vasquez", "Isabella"), ("Schmidt", "Felix"), ("Wong", "Jasmine"), ("Khan", "Omar"),
        ("Patel", "Neha"), ("Russo", "Giulia"), ("Singh", "Arjun"), ("Nguyen", "Minh"),
        ("Costa", "Ricardo"), ("Yoshida", "Sakura"), ("Alonso", "Alejandro"), ("Davies", "Rhys"),
        ("Peterson", "Ella"), ("Bernasconi", "Luca"), ("Moreau", "Élise"), ("Hernandez", "Carlos"),
        ("Ozdemir", "Elif"), ("Murphy", "Aidan"), ("Silveira", "Mateus"), ("Jensen", "Astrid")
    ]

    entries = []
    for _ in range(num_entries):
        firstName = random.choice(names)
        lastName = random.choice(names)
        uid = uuid4().hex.upper()[0:6] + "/T-" + str(random.randint(0, 9)) + random.choice(['S', 'R', 'M'])
        score = random_between(2, 88)
        fingerprint_on = "REX " + uuid4().hex.upper()[0:12]

        entry = f"""<h4>{lastName[0]}, {firstName[1]}</h4><div class="data">UID: {uid}; Score: {score}</div><div id="data2" class="small op50 italics">Fingerprint acquired on {fingerprint_on}</div>"""
        entries.append(entry)
    return entries

# Generate 1000 entries
entries_list = generate_entries(100)

# Example to save to a file (optional)
with open("entries.html", "w", encoding="utf-8") as file:
    for entry in entries_list:
        file.write(entry + "\n")
