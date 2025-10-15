import React, { useState } from 'react';
import {
  FolderIcon,
  DocumentTextIcon,
  PhotoIcon,
  FilmIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  FolderOpenIcon,
  PlusIcon,
  CloudArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Documents = ({ documents, patientId }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.uploadDate - a.uploadDate;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        return b.size - a.size;
      }
      return 0;
    });

  // Get unique categories
  const categories = [...new Set(documents.map(doc => doc.category))];

  // Get file icon based on type
  const getFileIcon = (type, category) => {
    if (type.startsWith('image/')) {
      return PhotoIcon;
    } else if (type.startsWith('video/')) {
      return FilmIcon;
    } else if (category === 'Lab Results' || category === 'Reports') {
      return DocumentTextIcon;
    } else {
      return DocumentTextIcon;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Lab Results': 'bg-blue-100 text-blue-800',
      'Imaging': 'bg-purple-100 text-purple-800',
      'Reports': 'bg-green-100 text-green-800',
      'Insurance': 'bg-yellow-100 text-yellow-800',
      'Prescriptions': 'bg-red-100 text-red-800',
      'Forms': 'bg-gray-100 text-gray-800',
      'Other': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Group documents by category
  const documentsByCategory = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  return (
    <div className="medical-records-content space-y-6">
      {/* Header and Controls */}
      <div className="medical-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FolderIcon className="w-6 h-6 text-blue-600 mr-3" />
              Medical Documents
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage patient documents, reports, images, and medical records
            </p>
          </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
            Upload Document
          </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="medical-card p-6">
          <div className="flex items-center">
            <FolderIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="medical-card p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lab Results</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(doc => doc.category === 'Lab Results').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="medical-card p-6">
          <div className="flex items-center">
            <PhotoIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Imaging</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(doc => doc.category === 'Imaging').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="medical-card p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-amber-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(doc => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return doc.uploadDate >= monthAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents by Category */}
      <div className="space-y-6">
        {Object.entries(documentsByCategory).map(([category, categoryDocs]) => (
          <div key={category} className="medical-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="document-icon mr-3 w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                    <FolderOpenIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{category}</h4>
                    <span className="text-sm text-gray-500">{categoryDocs.length} documents</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {categoryDocs.map((document) => {
                const FileIcon = getFileIcon(document.type, document.category);
                
                return (
                  <div key={document.id} className="p-6 hover:bg-blue-50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="document-icon w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 border-2 border-gray-200">
                            <FileIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h5 className="text-lg font-medium text-gray-900 truncate">
                              {document.name}
                            </h5>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(document.category)}`}>
                              {document.category}
                            </span>
                          </div>
                          
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                              <span>Uploaded: {document.uploadDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <UserIcon className="w-4 h-4 mr-1 text-gray-400" />
                              <span>By: {document.uploadedBy}</span>
                            </div>
                            <div className="flex items-center">
                              <TagIcon className="w-4 h-4 mr-1 text-gray-400" />
                              <span>Size: {formatFileSize(document.size)}</span>
                            </div>
                          </div>
                          
                          {document.description && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">{document.description}</p>
                            </div>
                          )}
                          
                          {document.tags && document.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {document.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={() => setSelectedDocument(document)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-2 rounded-lg transition-all duration-200"
                          title="View Document"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-700 hover:bg-green-100 p-2 rounded-lg transition-all duration-200"
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 p-2 rounded-lg transition-all duration-200"
                          title="Share"
                        >
                          <ShareIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-base font-medium text-blue-600 hover:text-blue-500">
                      Upload files
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi"
                    />
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, Word, Images, Videos up to 10MB each
                  </p>
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Selected Files ({selectedFiles.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newFiles = selectedFiles.filter((_, i) => i !== index);
                            setSelectedFiles(newFiles);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Lab Results">Lab Results</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Reports">Reports</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Prescriptions">Prescriptions</option>
                    <option value="Forms">Forms</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a description for these documents..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tags separated by commas..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={selectedFiles.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedDocument.name}
                </h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Document Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Document Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Category:</span> {selectedDocument.category}</div>
                    <div><span className="font-medium">Size:</span> {formatFileSize(selectedDocument.size)}</div>
                    <div><span className="font-medium">Type:</span> {selectedDocument.type}</div>
                    <div><span className="font-medium">Uploaded:</span> {selectedDocument.uploadDate.toLocaleDateString()}</div>
                    <div><span className="font-medium">Uploaded by:</span> {selectedDocument.uploadedBy}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-sm text-gray-700">
                    {selectedDocument.description || 'No description available'}
                  </p>
                  
                  {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDocument.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">Document Preview</h4>
                <div className="flex items-center justify-center h-64 bg-white border rounded">
                  {selectedDocument.type.startsWith('image/') ? (
                    <PhotoIcon className="h-24 w-24 text-gray-300" />
                  ) : (
                    <DocumentTextIcon className="h-24 w-24 text-gray-300" />
                  )}
                  <div className="ml-4 text-center">
                    <p className="text-gray-600">Preview not available</p>
                    <p className="text-sm text-gray-500">Click download to view full document</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700">
                  Share Document
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="medical-card p-12 text-center">
          <div className="document-icon w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <FolderIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterCategory !== 'all' 
              ? 'No documents match your current filters. Try adjusting your search criteria.'
              : 'No documents have been uploaded for this patient yet. Get started by uploading your first document.'
            }
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center mx-auto transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
            Upload First Document
          </button>
        </div>
      )}
    </div>
  );
};

export default Documents;