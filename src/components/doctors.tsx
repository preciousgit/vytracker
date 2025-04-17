import { useState } from "react";

type Specialist = {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
  image: string;
  about: string;
};

const specialists: Specialist[] = [
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("");
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  const filteredSpecialists = specialists.filter(
    (specialist) =>
      specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterSpecialty === "" || specialist.specialty === filterSpecialty)
  );

  return (
    <div className="text-white text-center px-6 py-10 bg-blue-800">
      <h2 className="text-4xl font-bold mb-6">Meet Our Specialists</h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 rounded border border-gray-300 text-black"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded border border-gray-300 text-black"
          value={filterSpecialty}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSpecialty(e.target.value)}
        >
          <option value="">All Specialties</option>
          {[...new Set(specialists.map((s) => s.specialty))].map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSpecialists.map((specialist) => (
          <div
            key={specialist.id}
            className="bg-white text-black rounded-lg shadow-md p-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedSpecialist(specialist)}
          >
            <img
              src={specialist.image}
              alt={specialist.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold">{specialist.name}</h3>
            <p className="text-sm text-gray-700">{specialist.specialty}</p>
          </div>
        ))}
      </div>

      {selectedSpecialist && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedSpecialist(null)}
        >
          <div
            className="bg-white text-black p-6 rounded-lg max-w-md text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-2">{selectedSpecialist.name}</h3>
            <p className="font-medium text-blue-800 mb-1">{selectedSpecialist.specialty}</p>
            <p className="mb-4">{selectedSpecialist.about}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
              onClick={() => setSelectedSpecialist(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialistSection;
