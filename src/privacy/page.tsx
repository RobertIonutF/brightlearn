// src/app/privacy/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: 'Politica de Confidențialitate | BrightLearn',
  description: 'Aflați cum BrightLearn protejează și gestionează datele dvs. personale pentru a vă oferi o experiență de învățare sigură și personalizată.',
};

const PrivacySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Politica de Confidențialitate BrightLearn</h1>
      
      <p className="text-lg text-center mb-8">
        Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
      </p>

      <PrivacySection title="1. Introducere">
        <p>
          BrightLearn se angajează să protejeze confidențialitatea utilizatorilor săi. Această Politică de Confidențialitate explică modul în care colectăm, utilizăm, divulgăm și protejăm informațiile dvs. personale atunci când utilizați platforma noastră de învățare online.
        </p>
      </PrivacySection>

      <PrivacySection title="2. Informațiile pe care le colectăm">
        <p>Putem colecta următoarele tipuri de informații:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Informații de înregistrare (nume, adresă de email, parolă)</li>
          <li>Date de profil (vârstă, nivel de educație, interese de învățare)</li>
          <li>Informații despre progresul învățării (lecții completate, scoruri la quiz-uri)</li>
          <li>Date de utilizare (interacțiuni cu platforma, timp petrecut pe lecții)</li>
          <li>Informații despre dispozitiv și conexiune</li>
        </ul>
      </PrivacySection>

      <PrivacySection title="3. Cum utilizăm informațiile dvs.">
        <p>Utilizăm informațiile colectate pentru:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Personalizarea experienței de învățare</li>
          <li>Îmbunătățirea conținutului și funcționalităților platformei</li>
          <li>Comunicarea cu dvs. despre actualizări și noi funcționalități</li>
          <li>Asigurarea securității contului dvs.</li>
          <li>Analiza tendințelor de utilizare pentru îmbunătățirea serviciilor noastre</li>
        </ul>
      </PrivacySection>

      <PrivacySection title="4. Partajarea informațiilor">
        <p>
          Nu vindem sau închiriem informațiile dvs. personale unor terțe părți. Putem partaja informații în următoarele situații:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Cu furnizori de servicii care ne ajută să operăm platforma</li>
          <li>În cazul în care suntem obligați legal să o facem</li>
          <li>Cu consimțământul dvs. explicit</li>
        </ul>
      </PrivacySection>

      <PrivacySection title="5. Securitatea datelor">
        <p>
          Implementăm măsuri de securitate tehnice și organizatorice pentru a proteja informațiile dvs. personale împotriva accesului neautorizat, modificării, divulgării sau distrugerii.
        </p>
      </PrivacySection>

      <PrivacySection title="6. Drepturile dvs. privind datele">
        <p>Aveți dreptul să:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Accesați și să obțineți o copie a datelor dvs.</li>
          <li>Rectificați datele inexacte</li>
          <li>Solicitați ștergerea datelor dvs.</li>
          <li>Vă opuneți sau să restricționați procesarea datelor dvs.</li>
          <li>Solicitați portabilitatea datelor</li>
        </ul>
      </PrivacySection>

      <PrivacySection title="7. Modificări ale Politicii de Confidențialitate">
        <p>
          Putem actualiza această politică periodic. Vă vom notifica despre orice modificări semnificative prin email sau prin intermediul platformei noastre.
        </p>
      </PrivacySection>

      <PrivacySection title="8. Contact">
        <p>
          Pentru orice întrebări sau preocupări legate de această Politică de Confidențialitate, vă rugăm să ne contactați la:
        </p>
        <p className="mt-2">
          Email: privacy@brightlearn.com<br />
          Adresa: Strada Învățării, Nr. 123, București, România
        </p>
      </PrivacySection>
    </div>
  );
}