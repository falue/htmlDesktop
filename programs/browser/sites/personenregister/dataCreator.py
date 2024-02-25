# https://faker.readthedocs.io/

from faker import Faker
import random

num_of_lines = 300

# Adjusting the generation to use only Swiss names and increasing the total to 150 rows
fake = Faker("de_CH")  # Focusing on Swiss names
# Faker.seed(0)  # Resetting seed for consistency with new parameters

# Re-define lists of car brands, models, and sex for context
wohnort = ["Zürich", "Geneva", "Basel", "Lausanne", "Bern", "Lucerne", "Winterthur", "St. Gallen", "Lugano", "Biel/Bienne", "Thun", "Köniz", "La Chaux-de-Fonds", "Schaffhausen", "Fribourg", "Chur", "Neuchâtel", "Vernier", "Sion", "Uster", "Emmen", "Zug", "Lancy", "Yverdon-les-Bains", "Montreux", "Frauenfeld", "Dübendorf", "Wil", "Kriens", "Bulle", "Bellinzona", "Olten", "Langenthal", "Baden", "Wettingen", "Allschwil", "Baar", "Rapperswil-Jona", "Reinach", "Meyrin", "Horgen", "Vevey", "Gossau", "Martigny", "Herisau", "Sierre", "Riehen", "Thalwil", "Pully", "Stadt Winterthur"]
jahrgang = ["1955", "1956", "1957", "1958", "1959", "1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"]
todesjahr = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"]
sex = ["M", "F","M", "F","M", "F"]

# Generate 150 rows of data with Swiss names
rows_swiss = []
with open('data.html', 'w', encoding='utf-8') as file:
    for _ in range(num_of_lines):
        first_name = fake.first_name()
        last_name = fake.last_name()
        ort = random.choice(wohnort)
        jahr = random.choice(jahrgang)
        tod = random.choice(todesjahr)
        sex = random.choice(sex)
        job = fake.job()
        passportNum = fake.passport_number()
        row_swiss = f"<tr><td>{last_name}, {first_name}</td><td>{job}</td><td>{passportNum}</td><td>{jahr}</td><td>{tod}</td><td>{ort}</td></tr>\n"
        rows_swiss.append(row_swiss)
        file.write(row_swiss)

print("Die Daten wurden in 'data.txt' geschrieben.")
