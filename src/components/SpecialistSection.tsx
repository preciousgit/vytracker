import { useState } from "react";
import Image from "next/image";
import "../app/globals.css";



const specialists = [
  { id: 1, name: "Dr. Ajewole Olamide", specialty: "Cardiologist", available: true, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c", about: "Expert in heart diseases and cardiac treatments." },
  { id: 2, name: "Dr. Olowoyeye Daniel", specialty: "Neurologist", available: false, image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e", about: "Specialist in brain and nervous system disorders." },
  { id: 3, name: "Dr. Olorunga Promise", specialty: "Pediatrician", available: true, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1", about: "Loves working with children and improving their health." },
  { id: 4, name: "Dr. Adetoro Prince", specialty: "Dermatologist", available: true, image: "https://images.unsplash.com/photo-1578916171728-d6c34d7c9ff6", about: "Skincare expert treating various skin conditions." },
  { id: 5, name: "Dr. Agatha Rachael", specialty: "Orthopedic", available: false, image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39", about: "Bone and joint specialist focused on mobility." },
  { id: 6, name: "Dr. Akingbade Adebisi", specialty: "Gynecologist", available: true, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec3", about: "Dedicated to women's reproductive health and care." },
  { id: 7, name: "Dr. Ayanlola Abosede", specialty: "Ophthalmologist", available: false, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", about: "Eye disease and vision correction specialist." },
  { id: 8, name: "Dr. Faith Precious", specialty: "Endocrinologist", available: true, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7", about: "Treating hormonal imbalances and metabolic disorders." },
  { id: 9, name: "Dr. James Anderson", specialty: "Psychiatrist", available: true, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f", about: "Specialist in mental health and therapy." },
  { id: 10, name: "Dr. Adeyemi Olu", specialty: "Urologist", available: false, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1", about: "Specialist in urinary tract and kidney diseases." },
  { id: 11, name: "Dr. Johnson Smith", specialty: "General Surgeon", available: true, image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136", about: "Expert in various types of surgeries." },
  { id: 12, name: "Dr. Veronica Thomas", specialty: "Anesthesiologist", available: false, image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e", about: "Manages pain and sedation during surgeries." },
  { id: 13, name: "Dr. Henry Paul", specialty: "Radiologist", available: true, image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136", about: "Specialist in medical imaging and diagnosis." },
  { id: 14, name: "Dr. Sophia Turner", specialty: "Oncologist", available: false, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7", about: "Expert in cancer treatment and care." },
  { id: 15, name: "Dr. Michael David", specialty: "Pulmonologist", available: true, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f", about: "Lung and respiratory disease specialist." },
  { id: 16, name: "Dr. Janet Peters", specialty: "Gastroenterologist", available: true, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1", about: "Expert in digestive system and stomach issues." },
  { id: 17, name: "Dr. Nathaniel Grace", specialty: "Nephrologist", available: false, image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136", about: "Kidney specialist and dialysis expert." },
  { id: 18, name: "Dr. Ethan James", specialty: "Allergist", available: true, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7", about: "Diagnoses and treats allergies and immune disorders." },
  { id: 19, name: "Dr. Isabella White", specialty: "Rheumatologist", available: false, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f", about: "Expert in arthritis and joint diseases." },
  { id: 20, name: "Dr. Benjamin Scott", specialty: "Hematologist", available: true, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1", about: "Blood disease and clotting disorder specialist." }
];

const SpecialistSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState<typeof specialists[0] | null>(null);

  const filteredSpecialists = specialists.filter(
    (specialist) =>
      specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterSpecialty === "" || specialist.specialty === filterSpecialty)
  );

  return (
    <div className="specialist-container">
      <h2 className="title">Meet Our Specialists</h2>
      <input
        type="text"
        placeholder="Search by name..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select
        className="filter-dropdown"
        value={filterSpecialty}
        onChange={(e) => setFilterSpecialty(e.target.value)}
      >
        <option value="">All Specialties</option>
        {[...new Set(specialists.map((s) => s.specialty))].map((specialty) => (
          <option key={specialty} value={specialty}>{specialty}</option>
        ))}
      </select>
      <div className="specialist-grid">
        {filteredSpecialists.map((specialist) => (
          <button key={specialist.id} className="specialist-card" onClick={() => setSelectedSpecialist(specialist)} tabIndex={0} onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedSpecialist(specialist); }}>
            <Image src={specialist.image} alt={specialist.name} className="specialist-image" width={500} height={500} />
            <h3>{specialist.name}</h3>
            <p>{specialist.specialty}</p>
          </button>
        ))}
      </div>
      {selectedSpecialist && (
        <button className="modal-overlay" onClick={() => setSelectedSpecialist(null)} onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedSpecialist(null); }}>
          <div className="modal">
            <h3>{selectedSpecialist.name}</h3>
            <p>{selectedSpecialist.specialty}</p>
            <p>{selectedSpecialist.about}</p>
            <button onClick={() => setSelectedSpecialist(null)}>Close</button>
          </div>
        </button>
      )}
    </div>
  );
};

export default SpecialistSection;