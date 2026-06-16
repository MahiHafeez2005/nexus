// Import useState for managing document state
import { useState, useRef } from 'react';
// Import SignatureCanvas for e-signature
import SignatureCanvas from 'react-signature-canvas';

export default function DocumentChamber() {
  // State: Uploaded file
  const [file, setFile] = useState<File | null>(null);
  // State: Document status (Draft, In Review, Signed)
  const [status, setStatus] = useState<'Draft' | 'In Review' | 'Signed'>('Draft');
  // State: Is signature saved?
  const [isSigned, setIsSigned] = useState(false);
  // Reference to the signature pad
  const sigPadRef = useRef<SignatureCanvas>(null);

  // Function: Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('Draft');
      setIsSigned(false);
      // Clear signature when new file is uploaded
      if (sigPadRef.current) {
        sigPadRef.current.clear();
      }
    }
  };

  // Function: Clear signature
  const clearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
    }
  };

  // Function: Save signature
  const saveSignature = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      setIsSigned(true);
      setStatus('In Review');
      alert('Signature saved! Document status changed to "In Review"');
    } else {
      alert('Please draw your signature first');
    }
  };

  // Function: Finalize signing
  const finalizeSign = () => {
    if (isSigned) {
      setStatus('Signed');
      alert('Document fully signed! ✅');
    } else {
      alert('Please save your signature first');
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'Draft': return 'text-yellow-600';
      case 'In Review': return 'text-blue-600';
      case 'Signed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Document Chamber
      </h3>
      
      {/* Upload Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Deal / Contract (PDF)
        </label>
        <input 
          type="file" 
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </div>

      {/* Document Info */}
      {file && (
        <div className="space-y-4">
          {/* File info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div>
                <span className={`font-medium ${getStatusColor()}`}>
                  Status: {status}
                </span>
              </div>
            </div>
          </div>

          {/* Signature Pad */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              E-Signature Pad
            </p>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <SignatureCanvas 
                ref={sigPadRef}
                canvasProps={{
                  className: 'w-full h-32 bg-white'
                }}
                backgroundColor="white"
              />
            </div>
            
            {/* Signature buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={clearSignature}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear
              </button>
              <button
                onClick={saveSignature}
                className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save Signature
              </button>
              <button
                onClick={finalizeSign}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Finalize & Sign
              </button>
            </div>
            
            {/* Signature status */}
            {isSigned && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Signature saved
              </p>
            )}
          </div>

          {/* Document Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => alert('Document preview would open here')}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              📄 Preview Document
            </button>
            <button
              onClick={() => alert('Document downloaded!')}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ⬇️ Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}