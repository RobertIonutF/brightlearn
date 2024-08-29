// src/app/terms/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: 'Termeni și Condiții | BrightLearn',
  description: 'Termenii și condițiile de utilizare a platformei BrightLearn.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Termeni și Condiții BrightLearn</h1>

      <Card>
        <CardHeader>
          <CardTitle>1. Acceptarea Termenilor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Prin utilizarea platformei BrightLearn, acceptați să respectați acești Termeni și Condiții. Vă rugăm să citiți cu atenție înainte de a utiliza serviciile noastre.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Descrierea Serviciului</CardTitle>
        </CardHeader>
        <CardContent>
          <p>BrightLearn oferă o platformă de învățare online cu lecții interactive, quiz-uri și asistență AI. Ne rezervăm dreptul de a modifica sau întrerupe serviciul în orice moment.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Înregistrare și Cont</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Pentru a utiliza complet serviciile noastre, trebuie să vă creați un cont. Sunteți responsabil pentru menținerea confidențialității contului și a parolei dumneavoastră.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Conținut și Drepturi de Autor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Conținutul generat de utilizatori rămâne proprietatea acestora. Acordați BrightLearn o licență pentru a utiliza, distribui și afișa acest conținut pe platformă. Respectați drepturile de autor ale altor utilizatori și ale BrightLearn.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Conduită și Utilizare Acceptabilă</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nu este permisă utilizarea platformei pentru activități ilegale sau dăunătoare. BrightLearn își rezervă dreptul de a suspenda sau închide conturile care încalcă aceste reguli.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Confidențialitate</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Utilizarea datelor personale este guvernată de Politica noastră de Confidențialitate. Vă rugăm să o consultați pentru informații detaliate.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Limitarea Răspunderii</CardTitle>
        </CardHeader>
        <CardContent>
          <p>BrightLearn nu este responsabilă pentru orice daune directe, indirecte, incidentale sau consecvente rezultate din utilizarea sau imposibilitatea de a utiliza serviciile noastre.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Modificări ale Termenilor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările vor intra în vigoare imediat după publicarea lor pe platformă. Continuarea utilizării serviciului după modificări constituie acceptarea noilor termeni.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Rezilierea Contului</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Puteți rezilia contul în orice moment. BrightLearn își rezervă dreptul de a rezilia sau suspenda accesul la serviciu fără notificare prealabilă pentru încălcarea acestor termeni.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. Legea Aplicabilă</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Acești termeni sunt guvernați de legile României. Orice dispută va fi rezolvată în instanțele competente din România.</p>
        </CardContent>
      </Card>

      <p className="text-center mt-8">
        Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
      </p>
    </div>
  );
}