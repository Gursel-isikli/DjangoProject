from django.db import models

#Kunde (Customer)
#--------------------------------
class Kunden(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    telefon = models.CharField(max_length=50)
    adresse = models.TextField()
    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


#Rechnung (Invoice)
#----------------------------------
class Rechnung(models.Model):

    STATUS_CHOICES = [
        ('offen', 'Offen'),
        ('bezahlt', 'Bezahlt'),
        ('ueberfaellig', 'Überfällig'),
    ]

    kunde = models.ForeignKey(Kunden, on_delete=models.CASCADE)
    rechnungsnummer = models.CharField(max_length=50, unique=True)
    datum = models.DateField()
    faelligkeitsdatum = models.DateField()
    betrag = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offen')

    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.rechnungsnummer

    # Total(Invoice Items'tan)
   
    def gesamtbetrag(self):
        return sum(p.menge * p.preis for p in self.positionen.all())

    def bezahlt_betrag(self):
        return sum(z.betrag for z in self.zahlungen.all())

    def restbetrag(self):
        return self.gesamtbetrag() - self.bezahlt_betrag()


# Rechnungsposition
#----------------------------
class Rechnungsposition(models.Model):
    rechnung = models.ForeignKey(
        Rechnung,
        on_delete=models.CASCADE,
        related_name='positionen'
    )
    beschreibung = models.CharField(max_length=255)
    menge = models.PositiveIntegerField()
    preis = models.DecimalField(max_digits=10, decimal_places=2)

    def gesamtpreis(self):
        return self.menge * self.preis

    def __str__(self):
        return self.beschreibung


# Zahlung (Payment)
#--------------------------
class Zahlung(models.Model):

    METHOD_CHOICES = [
        ('bank', 'Bank'),
        ('paypal', 'PayPal'),
        ('cash', 'Cash'),
    ]

    rechnung = models.ForeignKey(
        Rechnung,
        on_delete=models.CASCADE,
        related_name='zahlungen'
    )
    betrag = models.DecimalField(max_digits=10, decimal_places=2)
    datum = models.DateField()
    methode = models.CharField(max_length=20, choices=METHOD_CHOICES)

    def __str__(self):
        return f"{self.betrag} CHF - {self.rechnung.rechnungsnummer}"


# Mahnung (Reminder)
#-----------------------------
class Mahnung(models.Model):

    rechnung = models.ForeignKey(
        Rechnung,
        on_delete=models.CASCADE,
        related_name='mahnungen'
    )
    mahnstufe = models.PositiveIntegerField()  # 1,2,3
    datum = models.DateField()
    gebuehr = models.DecimalField(max_digits=10, decimal_places=2)
    gesendet = models.BooleanField(default=False)

    def __str__(self):
        return f"Mahnung {self.mahnstufe} - {self.rechnung.rechnungsnummer}"


# InvoiceDocument (PDF)
#----------------------------
class InvoiceDocument(models.Model):
    rechnung = models.ForeignKey(
        Rechnung,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    file = models.FileField(upload_to='invoices/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PDF - {self.rechnung.rechnungsnummer}"


# ScannedDocument (OCR)
#-----------------------------
class ScannedDocument(models.Model):
    file = models.FileField(upload_to='scans/')
    extracted_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return f"Scan {self.id}"


