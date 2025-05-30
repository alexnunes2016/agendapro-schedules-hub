
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useMedicalRecordsPermissions } from "@/hooks/useMedicalRecordsPermissions";
import MedicalRecordsHeader from "@/components/medical/MedicalRecordsHeader";
import MedicalRecordsLoading from "@/components/medical/MedicalRecordsLoading";
import MedicalRecordsAccessDenied from "@/components/medical/MedicalRecordsAccessDenied";
import MedicalRecordsList from "@/components/medical/MedicalRecordsList";
import CreateMedicalRecordModal from "@/components/medical/CreateMedicalRecordModal";
import ViewMedicalRecordModal from "@/components/medical/ViewMedicalRecordModal";

interface MedicalRecord {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string | null;
  date_of_birth: string | null;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const MedicalRecords = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  
  const { user, profile, loading: authLoading } = useAuth();
  const { records, loading, refetch } = useMedicalRecords();
  const { canAccessMedicalRecords, canCreateRecords } = useMedicalRecordsPermissions();

  const handleRecordCreated = () => {
    refetch();
    setShowCreateModal(false);
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  // Show loading while auth is loading
  if (authLoading || loading) {
    return <MedicalRecordsLoading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <MedicalRecordsAccessDenied type="unauthenticated" />;
  }

  if (!canAccessMedicalRecords()) {
    return <MedicalRecordsAccessDenied type="service-restricted" />;
  }

  if (!canCreateRecords()) {
    return <MedicalRecordsAccessDenied type="plan-restricted" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MedicalRecordsHeader onCreateNew={() => setShowCreateModal(true)} />

      <div className="p-6">
        <MedicalRecordsList
          records={records}
          onViewRecord={handleViewRecord}
          onCreateNew={() => setShowCreateModal(true)}
          userPlan={profile?.plan || 'free'}
        />
      </div>

      <CreateMedicalRecordModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleRecordCreated}
      />

      {selectedRecord && (
        <ViewMedicalRecordModal
          open={showViewModal}
          onOpenChange={setShowViewModal}
          record={selectedRecord}
          userPlan={profile?.plan || 'free'}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

export default MedicalRecords;
