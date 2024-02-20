from faker import Faker
import random

# Adjusting the generation to use only Swiss names and increasing the total to 150 rows
fake = Faker("de_CH")  # Focusing on Swiss names
# Faker.seed(0)  # Resetting seed for consistency with new parameters

# Re-define lists of car brands, models, and colors for context
car_brands = ["AlpenMotors", "Bergwerk", "Cascadia", "Dynasty", "Echelon", "Falcon", "Gallant", "Horizon"]
car_models = ["Alpina B7", "Summit X1", "Ranger GT", "Prime Z", "Quantum S", "Nova 5", "Orion 3", "Pulse R"]
colors = ["Schwarz", "Weiss", "Rot", "Blau", "Grün", "Silber", "Grau", "Gelb"]

# Generate 150 rows of data with Swiss names
rows_swiss = []
with open('fahrzeugdaten.html', 'w', encoding='utf-8') as file:
    for _ in range(150):
        name = fake.name()
        brand = random.choice(car_brands)
        model = random.choice(car_models)
        color = random.choice(colors)
        plate = fake.license_plate()
        row_swiss = f"<tr><td>{name}</td><td>{brand}</td><td>{model}</td><td>{color}</td><td>{plate}</td></tr>\n"
        rows_swiss.append(row_swiss)
        file.write(row_swiss)

print("Die Daten wurden in 'fahrzeugdaten.txt' geschrieben.")
