'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function CasePage() {
    const [view, setView] = useState('home'); // 'home' | 'existing' | 'caseView' | 'fileView'
    const [showModal, setShowModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [addingTemplate, setAddingTemplate] = useState(false);
    const [showTemplateForm, setShowTemplateForm] = useState(false);
    const [caseTitle, setCaseTitle] = useState('');
    const [caseType, setCaseType] = useState('');
    const [selectedCase, setSelectedCase] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [fileFormat, setFileFormat] = useState('word');
    const [userFiles, setUserFiles] = useState([]);

const [cases, setCases] = useState([]);
const [showAddFileModal, setShowAddFileModal] = useState(false);
const [showAddExistingFileModal, setShowAddExistingFileModal] = useState(false);

    const [templateData, setTemplateData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
        email: '',
        mobile: '',
        caseLabel: '',
        jurisdiction: '',
        category: '',
        otherCategory: '',
        status: '',
        lawFirm: '',
        caseDetail: '',
        caseRegistrationNo: '',
        receivedBy: '',
        filingDate: ''
    });

    const { data: session } = useSession();

// Add this useEffect to fetch cases
useEffect(() => {
  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  fetchCases();
}, [session]);

// Update handleCreateCase
const handleCreateCase = async () => {
  if (!caseTitle || !caseType) return alert('Please fill all fields.');
  
  try {
    const response = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: caseTitle, type: caseType })
    });
    
    if (!response.ok) throw new Error('Login Required to create case');
    
    const newCase = await response.json();
    setSelectedCase(newCase);
    setCases(prev => [newCase, ...prev]);
    setShowModal(false);
    setView('caseView');
    setCaseTitle('');
    setCaseType('');
  } catch (error) {
    console.error('Error creating case:', error);
    alert(error.message || 'Error creating case');
  }
};

// Add these functions for file management
const handleAddFileToCase = async (file) => {
  if (!selectedCase) return;
  
  try {
    const response = await fetch(`/api/cases/${selectedCase._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId: file._id })
    });
    
    if (!response.ok) throw new Error('Failed to add file to case');
    
    const updatedCase = await response.json();
    setSelectedCase(updatedCase);
    setShowAddExistingFileModal(false);

    
  } catch (error) {
    console.error('Error adding file to case:', error);
    alert('Error adding file to case');
  }
};

const handleFileUploadForCase = async () => {
  if (!selectedFile) {
    setUploadStatus('Please select a file first.');
    return;
  }

  if (!session?.user) {
    return alert('Login required to save files');
  }

  try {
    // Convert file to Base64 string
    const arrayBuffer = await selectedFile.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    const response = await fetch('/api/files/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: selectedFile.name,
        filetype: selectedFile.type,
        size: selectedFile.size,
        content: base64String,
      }),
    });

    if (!response.ok) throw new Error('Failed to save file');

    const file = await response.json();
    await handleAddFileToCase(file.file);
    
    setUploadStatus('File saved and added to case!');
    setSelectedFile(null);
    setShowAddFileModal(false);

    // Refresh files list
    const filesRes = await fetch('/api/files');
    const filesData = await filesRes.json();
    setUserFiles(filesData);

  } catch (error) {
    console.error('Error saving file:', error);
    setUploadStatus('Error saving file');
  }
};

useEffect(() => {
  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      setUserFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  fetchFiles();
}, [session]);


const handleFileDownload = (file) => {
  // file.content.data is an array of numbers from the Buffer
  const byteArray = new Uint8Array(file.content.data);
  const blob = new Blob([byteArray], { type: file.filetype });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!validTypes.includes(file.type)) {
            setUploadStatus('Invalid file type. Only PDF, DOCX, and TXT files are allowed.');
            return;
        }

        // Check file size (16MB limit)
        if (file.size > 16 * 1024 * 1024) {
            setUploadStatus('File size exceeds 16MB limit.');
            return;
        }

        setSelectedFile(file);
        setUploadStatus(`Selected: ${file.name}`);
    };

    const handleFileUpload = async () => {
  if (!selectedFile) {
    setUploadStatus('Please select a file first.');
    return;
  }

  if (!session?.user) {
    return alert('Login required to save files');
  }

  try {
    // Convert file to Base64 string
    const arrayBuffer = await selectedFile.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    const response = await fetch('/api/files/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: selectedFile.name,
        filetype: selectedFile.type,
        size: selectedFile.size,
        content: base64String, // Base64 encoded
      }),
    });

    if (!response.ok) throw new Error('Failed to save file');

    setUploadStatus('File saved successfully!');
    setSelectedFile(null);

    // Refresh files list
    const filesRes = await fetch('/api/files');
    const filesData = await filesRes.json();
    setUserFiles(filesData);

  } catch (error) {
    console.error('Error saving file:', error);
    setUploadStatus('Error saving file');
  }
};

    const handleTemplateInputChange = (e) => {
        const { name, value } = e.target;
        setTemplateData(prev => ({
            ...prev,
            [name]: value
        }));
    };

  const generateTemplateFile = async (format) => {
  // Create HTML content from template data
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Basic Case Details</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .field { margin-bottom: 15px; }
        .field-name { font-weight: bold; }
        .section { margin-top: 30px; }
      </style>
    </head>
    <body>
      <h1>Basic Case Details</h1>
      <div class="section">
        <div class="field"><span class="field-name">First Name:</span> ${templateData.firstName}</div>
        <div class="field"><span class="field-name">Last Name:</span> ${templateData.lastName}</div>
        <div class="field"><span class="field-name">Address:</span> ${templateData.address}</div>
        <div class="field"><span class="field-name">City:</span> ${templateData.city}</div>
        <div class="field"><span class="field-name">Province:</span> ${templateData.province}</div>
        <div class="field"><span class="field-name">Postal Code:</span> ${templateData.postalCode}</div>
        <div class="field"><span class="field-name">Country:</span> ${templateData.country}</div>
        <div class="field"><span class="field-name">Email:</span> ${templateData.email}</div>
        <div class="field"><span class="field-name">Mobile No.:</span> ${templateData.mobile}</div>
      </div>
      <div class="section">
        <h2>Case Information</h2>
        <div class="field"><span class="field-name">Case Label:</span> ${templateData.caseLabel}</div>
        <div class="field"><span class="field-name">Jurisdiction:</span> ${templateData.jurisdiction}</div>
        <div class="field"><span class="field-name">Category:</span> ${templateData.category} ${templateData.category === 'Other' ? `(${templateData.otherCategory})` : ''}</div>
        <div class="field"><span class="field-name">Status:</span> ${templateData.status}</div>
        <div class="field"><span class="field-name">Law Firm:</span> ${templateData.lawFirm}</div>
        <div class="field"><span class="field-name">Case Detail:</span> ${templateData.caseDetail}</div>
        <div class="field"><span class="field-name">Case Registration No.:</span> ${templateData.caseRegistrationNo}</div>
        <div class="field"><span class="field-name">Received By:</span> ${templateData.receivedBy}</div>
        <div class="field"><span class="field-name">Filing Date:</span> ${templateData.filingDate}</div>
      </div>
    </body>
    </html>
  `;

  let filetype, filename;
  if (format === 'pdf') {
    filetype = 'application/pdf';
    filename = `CaseDetails_${Date.now()}.pdf`;
  } else {
    filetype = 'application/msword';
    filename = `CaseDetails_${Date.now()}.doc`;
  }

  // Create a Blob
  const blob = new Blob([htmlContent], { type: filetype });
   // Create a File object (so it behaves like uploaded files)
  const file = new File([blob], filename, { type: filetype });
  const arrayBuffer = await blob.arrayBuffer();

  // Convert to Base64
  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(arrayBuffer))
  );

   // Set file in the same state as manual upload
  setSelectedFile(file);
  setUploadStatus(`Selected: ${file.name}`);

  // Hide template UI
  setShowTemplateForm(false);
  setShowTemplateModal(false);
  setShowAddFileModal(addingTemplate);
    setAddingTemplate(false);
};

const handleDeleteFile = async (fileId) => {
  if (!confirm("Are you sure you want to delete this file?")) return;
  
  try {
    const response = await fetch(`/api/files/${fileId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete file');
    
    // Refresh files list
    const filesRes = await fetch('/api/files');
    const filesData = await filesRes.json();
    setUserFiles(filesData);
    
    // If we're in case view, refresh the case too
    if (selectedCase) {
      const caseRes = await fetch(`/api/cases/${selectedCase._id}`);
      const caseData = await caseRes.json();
      setSelectedCase(caseData);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('Error deleting file');
  }
};

const handleDeleteCase = async (caseId) => {
  if (!confirm("Are you sure you want to delete this case? This will not delete the files.")) return;
  
  try {
    const response = await fetch(`/api/cases/${caseId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete case');
    
    // Refresh cases list
    const casesRes = await fetch('/api/cases');
    const casesData = await casesRes.json();
    setCases(casesData);
    
    // If we're viewing the deleted case, go back to home
    if (selectedCase?._id === caseId) {
      setView('home');
      setSelectedCase(null);
    }
  } catch (error) {
    console.error('Error deleting case:', error);
    alert('Error deleting case');
  }
};

const handleRemoveFileFromCase = async (fileId) => {
  if (!confirm("Are you sure you want to remove this file from the case? The file will not be deleted.")) return;
  
  try {
    const response = await fetch(`/api/cases/${selectedCase._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId })
    });
    
    if (!response.ok) throw new Error('Failed to remove file from case');
    
    // Refresh the case
    const updatedCase = await response.json();
    setSelectedCase(updatedCase);
  } catch (error) {
    console.error('Error removing file from case:', error);
    alert('Error removing file from case');
  }
};


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white px-6 py-10 overflow-x-hidden transition-all duration-500">
            {/* ======= Modal for New Case ======= */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-purple-700 p-8 rounded-xl w-full max-w-md shadow-lg">
                        <h2 className="text-2xl font-semibold text-purple-200 mb-4">New Case</h2>

                        <input
                            type="text"
                            placeholder="Case Title"
                            className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                            value={caseTitle}
                            onChange={(e) => setCaseTitle(e.target.value)}
                        />

                        <div className="space-y-2 mb-6">
                            {['Civil', 'Criminal', 'Family', 'Corporate', 'Other'].map((type) => (
                                <label key={type} className="flex items-center space-x-3 text-purple-200">
                                    <input
                                        type="radio"
                                        value={type}
                                        checked={caseType === type}
                                        onChange={() => setCaseType(type)}
                                        className="form-radio text-purple-500"
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded"
                                onClick={handleCreateCase}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======= Template Selection Modal ======= */}
            {showTemplateModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-purple-700 p-8 rounded-xl w-full max-w-md shadow-lg">
                        <h2 className="text-2xl font-semibold text-purple-200 mb-6">Select Template</h2>
                        
                        <div className="space-y-3">
                            <button
                                className="w-full py-3 px-4 bg-purple-800/60 hover:bg-purple-700/80 text-white text-lg rounded-lg border border-purple-600 text-left"
                                onClick={() => {
                                    setShowTemplateForm(true);
                                    setShowTemplateModal(false);
                                }}
                            >
                                Basic Case Details
                            </button>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                                onClick={() => setShowTemplateModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======= Template Form Modal ======= */}
            {showTemplateForm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
                    <div className="bg-gray-900 border border-purple-700 p-8 rounded-xl w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-semibold text-purple-200 mb-6">Basic Case Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-purple-200 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={templateData.firstName}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={templateData.lastName}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-purple-200 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={templateData.address}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={templateData.city}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-1">Province</label>
                                <input
                                    type="text"
                                    name="province"
                                    value={templateData.province}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={templateData.postalCode}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={templateData.country}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={templateData.email}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-1">Mobile No.</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={templateData.mobile}
                                    onChange={handleTemplateInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                />
                            </div>
                        </div>

                        <div className="border-t border-purple-700 pt-6 mb-6">
                            <h3 className="text-xl font-semibold text-purple-200 mb-4">Case Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="md:col-span-2">
                                    <label className="block text-purple-200 mb-1">Case Label</label>
                                    <input
                                        type="text"
                                        name="caseLabel"
                                        value={templateData.caseLabel}
                                        onChange={handleTemplateInputChange}
                                        className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-purple-200 mb-1">Jurisdiction</label>
                                    <input
                                        type="text"
                                        name="jurisdiction"
                                        value={templateData.jurisdiction}
                                        onChange={handleTemplateInputChange}
                                        className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-200 mb-1">Category</label>
                                    <div className="space-y-2">
                                        {['Civil', 'Criminal', 'Family', 'Corporate', 'Other'].map((type) => (
                                            <label key={type} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={type}
                                                    checked={templateData.category === type}
                                                    onChange={handleTemplateInputChange}
                                                    className="form-radio text-purple-500"
                                                />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {templateData.category === 'Other' && (
                                        <input
                                            type="text"
                                            name="otherCategory"
                                            value={templateData.otherCategory}
                                            onChange={handleTemplateInputChange}
                                            className="w-full mt-2 px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                            placeholder="Specify other category"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-purple-200 mb-1">Status</label>
                                    <div className="space-y-2">
                                        {['Filed', 'Under Investigation', 'In Court', 'Closed'].map((status) => (
                                            <label key={status} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={status}
                                                    checked={templateData.status === status}
                                                    onChange={handleTemplateInputChange}
                                                    className="form-radio text-purple-500"
                                                />
                                                <span>{status}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-purple-200 mb-1">Law Firm</label>
                                    <input
                                        type="text"
                                        name="lawFirm"
                                        value={templateData.lawFirm}
                                        onChange={handleTemplateInputChange}
                                        className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-200 mb-1">Case Registration No.</label>
                                    <input
                                        type="text"
                                        name="caseRegistrationNo"
                                        value={templateData.caseRegistrationNo}
                                        onChange={handleTemplateInputChange}
                                        className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-200 mb-1">Received By</label>
                                    <input
                                        type="text"
                                        name="receivedBy"
                                        value={templateData.receivedBy}
                                        onChange={handleTemplateInputChange}
                                        className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-200 mb-1">Filing Date</label>
                                    <input
                                        type="date"
                                        name="filingDate"
                                        value={templateData.filingDate}
                                        onChange={handleTemplateInputChange}
                                        className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-purple-200 mb-1">Case Detail</label>
                                    <textarea
                                        name="caseDetail"
                                        value={templateData.caseDetail}
                                        onChange={handleTemplateInputChange}
                                        className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-600 text-white"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                     <div className="flex justify-between items-center space-x-3">
    <div className="flex items-center space-x-2 mr-2">
        <label className="flex items-center space-x-1">
            <input
                type="radio"
                checked={fileFormat === 'word'}
                onChange={() => setFileFormat('word')}
                className="form-radio text-purple-500"
            />
            <span>Word</span>
        </label>
    </div>
    <div className='flex items-center space-x-2'>
    <button
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        onClick={() => setShowTemplateForm(false)}
    >
        Cancel
    </button>
    <button
        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded"
        onClick={() => generateTemplateFile(fileFormat)}
    >
        Create Document
    </button>
    </div>
</div>
                    </div>
                </div>
            )}

            {/* ======= HOME VIEW ======= */}
            {view === 'home' && (
                <div className="flex flex-col items-center justify-center min-h-[80vh] text-center transition-all duration-500">
                    <h1 className="text-4xl font-bold mb-12 text-purple-100 tracking-wide">
                        ⚖️ Case Management
                    </h1>

                    <div className="space-y-6 w-full max-w-sm">
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full py-4 px-6 bg-purple-800/60 hover:bg-purple-700/80 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-700/50 transition-all backdrop-blur-md border border-purple-600"
                        >
                            ➕ New Case
                        </button>

        <button
  onClick={() => setView('existing')}
  className="w-full py-4 px-6 bg-gray-800/60 hover:bg-gray-700/80 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-700/50 transition-all backdrop-blur-md border border-gray-600"
>
  📁 Files & Cases
</button>

                        <button
                            onClick={() => setView('fileView')}
                            className="w-full py-4 px-6 bg-purple-900/50 hover:bg-purple-800/70 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-700/50 transition-all backdrop-blur-md border border-purple-700"
                        >
                            📎 Standalone File
                        </button>
                    </div>
                </div>
            )}

            {/* ======= EXISTING CASES VIEW ======= */}
{view === 'existing' && (
  <div className="transition-all duration-500">
       <button
  onClick={() => setView('home')}
  className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
>
  ← Back
</button>
    <h2 className="text-3xl font-bold mb-6 text-purple-100">📁 Files & Cases</h2>
    
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-purple-100">Your Cases</h3>
      <div className="bg-gray-800 border border-purple-700 rounded-xl overflow-hidden max-w-2xl w-full">
        <table className="w-full text-left">
          <thead className="bg-purple-900/60 text-purple-200">
            <tr>
              <th className="px-4 py-3">Case Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Files</th>
            </tr>
          </thead>
          <tbody>
           {cases.map((caseItem, i) => (
  <tr key={i} className="hover:bg-purple-800/30 transition-all">
    <td className="px-4 py-3 border-t border-purple-700">{caseItem.title}</td>
    <td className="px-4 py-3 border-t border-purple-700">{caseItem.type}</td>
    <td className="px-4 py-3 border-t border-purple-700">{caseItem.files?.length || 0}</td>
    <td className="px-4 py-3 border-t border-purple-700 text-right">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteCase(caseItem._id);
        }}
        className="text-red-400 hover:text-red-300 p-1"
        title="Delete case"
      >
        🗑️
      </button>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    
   
    </div>
    
    {/* Existing files table remains the same */}
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-purple-100">Your Files</h3>
      <div className="bg-gray-800 border border-purple-700 rounded-xl overflow-hidden max-w-2xl w-full">
        <table className="w-full text-left">
          <thead className="bg-purple-900/60 text-purple-200">
            <tr>
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="pl-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
         {userFiles.map((file, i) => (
  <tr key={i} className="hover:bg-purple-800/30 transition-all">
    <td className="px-4 py-3 border-t border-purple-700 max-w-[200px] truncate">
      {file.filename}
    </td>
    <td className="px-4 py-3 border-t border-purple-700">
      {file.filetype.includes("pdf") ? "PDF" : 
       file.filetype.includes("word") ? "Word" : 
       file.filetype.includes("plain") ? "Text" : 
       file.filetype.split("/").pop().toUpperCase()}
    </td>
    <td className="px-4 py-3 border-t border-purple-700 whitespace-nowrap">
      {new Date(file.createdAt).toLocaleDateString()}
    </td>
    <td className="px-4 py-3 border-t border-purple-700 text-right">
            <button 
        onClick={() => handleFileDownload(file)}
        className="text-purple-400 hover:text-purple-300"
        title="Download"
      >
        ⬇️
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteFile(file._id);
        }}
        className="text-red-400 hover:text-red-300 p-1"
        title="Delete file"
      >
        🗑️
      </button>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>

   
  </div>
)}

{/* // Update the Case View section */}
{view === 'caseView' && selectedCase && (
  <div className="transition-all duration-500">
       <button
  onClick={() => setView('home')}
  className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
>
  ← Back
</button>
    <div className="flex justify-between items-center mb-6">
      
      <h2 className="text-3xl font-bold text-purple-100">
        📑 {selectedCase.title}
        <span className="ml-3 text-sm font-normal bg-purple-900/50 px-2 py-1 rounded">
          {selectedCase.type}
        </span>
      </h2>
      <div className="flex space-x-3">
        <button
          onClick={() => setShowAddFileModal(true)}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded"
        >
          Add New File
        </button>
        <button
          onClick={() => setShowAddExistingFileModal(true)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Add Existing File
        </button>
      </div>
    </div>

    <div className="bg-gray-800 border border-purple-700 rounded-xl overflow-hidden max-w-2xl w-full">
      <table className="w-full text-left">
        <thead className="bg-purple-900/60 text-purple-200">
          <tr>
            <th className="px-4 py-3">File Name</th>
            {/* <th className="px-4 py-3">Type</th> */}
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
         {selectedCase.files?.map((file, i) => (
  <tr key={i} className="hover:bg-purple-800/30 transition-all">
    <td className="px-4 py-3 border-t border-purple-700">{file.filename}</td>
    <td className="px-4 py-3 border-t border-purple-700">
      {file.filetype.split('/')[1] || file.filetype}
    </td>
    <td className="px-4 py-3 border-t border-purple-700 flex space-x-3">
      <button 
        onClick={() => handleFileDownload(file)}
        className="text-purple-400 hover:text-purple-300"
        title="Download"
      >
        ⬇️
      </button>
      <button 
        onClick={() => handleRemoveFileFromCase(file._id)}
        className="text-red-400 hover:text-red-300"
        title="Remove from case"
      >
        🗑️
      </button>
    </td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  </div>
)}
            {/* ======= FILE VIEW ======= */}
            {view === 'fileView' && (
                <div className="flex flex-col items-center justify-center min-h-[80vh] text-center transition-all duration-500">
                    <h2 className="text-3xl font-bold mb-12 text-purple-100 tracking-wide">
                        📎 Standalone File Management
                    </h2>

                    <div className="space-y-6 w-full max-w-sm">
                        <div className="relative group">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                            />
                            <label
                                htmlFor="file-upload"
                                className="w-full py-4 px-6 bg-purple-800/60 hover:bg-purple-700/80 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-700/50 transition-all backdrop-blur-md border border-purple-600 cursor-pointer block"
                            >
                                📤 Upload File
                            </label>
                        </div>

                        <button
                            className="w-full py-4 px-6 bg-gray-800/60 hover:bg-gray-700/80 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-purple-700/50 transition-all backdrop-blur-md border border-gray-600"
                            onClick={() => setShowTemplateModal(true)}
                        >
                            🧾 Templates
                        </button>

                        {selectedFile && (
                            <button
                                onClick={handleFileUpload}
                                className="w-full py-4 px-6 bg-green-800/60 hover:bg-green-700/80 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-green-700/50 transition-all backdrop-blur-md border border-green-600"
                            >
                                💾 Save File
                            </button>
                        )}

                        <button
                            onClick={() => setView('home')}
                            className="w-full py-4 px-6 bg-gray-700/60 hover:bg-gray-600/80 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-gray-700/50 transition-all backdrop-blur-md border border-gray-500"
                        >
                            ← Back
                        </button>

                        {uploadStatus && (
                            <div className="mt-4 p-3 bg-gray-800/50 border border-purple-700 rounded-lg text-purple-200">
                                {uploadStatus}
                            </div>
                        )}
                    </div>
                </div>
            )}


{/* // Add these modals to the modal section */}
{showAddFileModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-purple-700 p-8 rounded-xl w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-semibold text-purple-200 mb-4">Add New File</h2>
      
      <div className="space-y-3 mb-6">
        <button
          className="w-full py-3 px-4 bg-purple-800/60 hover:bg-purple-700/80 text-white text-lg rounded-lg border border-purple-600 text-left"
          onClick={() => {
            setShowTemplateModal(true);
            setAddingTemplate(true);
            setShowAddFileModal(false);
          }}
        >
          Use Template
        </button>
        
        <div className="relative group">
          <input
            type="file"
            id="case-file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          />
          <label
            htmlFor="case-file-upload"
            className="w-full py-3 px-4 bg-purple-800/60 hover:bg-purple-700/80 text-white text-lg rounded-lg border border-purple-600 cursor-pointer block"
          >
            Upload File
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="mb-4 p-3 bg-gray-800/50 border border-purple-700 rounded-lg text-purple-200">
          {uploadStatus}
          <button
            onClick={handleFileUploadForCase}
            className="w-full mt-3 py-2 bg-green-700 hover:bg-green-600 rounded"
          >
            Save to Case
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          onClick={() => {
            setShowAddFileModal(false);
            setSelectedFile(null);
            setUploadStatus('');
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showAddExistingFileModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-purple-700 p-8 rounded-xl w-full max-w-4xl shadow-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-semibold text-purple-200 mb-4">Add Existing File</h2>
      
      <div className="bg-gray-800 border border-purple-700 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-900/60 text-purple-200">
            <tr>
              <th className="px-4 py-3">File Name</th>
              {/* <th className="px-4 py-3">Type</th> */}
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {userFiles.map((file, i) => (
              <tr key={i} className="hover:bg-purple-800/30 transition-all">
                <td className="px-4 py-3 border-t border-purple-700 max-w-[200px] truncate">
                  {file.filename}
                </td>
                {/* <td className="px-4 py-3 border-t border-purple-700">
                  {file.filetype.split('/')[1] || file.filetype}
                </td> */}
                <td className="px-4 py-3 border-t border-purple-700 whitespace-nowrap">
                  {new Date(file.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border-t border-purple-700">
                  <button
                    onClick={() => handleAddFileToCase(file)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Add to Case
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          onClick={() => setShowAddExistingFileModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        </div>
    );
}