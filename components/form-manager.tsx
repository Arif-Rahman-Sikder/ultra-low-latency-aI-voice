import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Trash2, Edit3, Check, X, Search, Filter, RefreshCw } from 'lucide-react';

interface FormData {
  id: string;
  name: string;
  email: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

const FormManager: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [currentForm, setCurrentForm] = useState<Partial<FormData>>({
    name: '',
    email: '',
    message: '',
    category: 'general',
    priority: 'medium',
    status: 'pending'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadInitialData();
    
    // Listen for voice commands
    const handleVoiceFormUpdate = (event: CustomEvent) => {
      const { field, value } = event.detail;
      setCurrentForm(prev => ({ ...prev, [field]: value }));
    };
    
    const handleVoiceFormSubmit = () => {
      if (currentForm.name && currentForm.email && currentForm.message) {
        handleSubmit(new Event('submit') as any);
      } else {
        alert('Please fill in all required fields (name, email, message) before submitting.');
      }
    };
    
    window.addEventListener('voiceFormUpdate', handleVoiceFormUpdate as EventListener);
    window.addEventListener('voiceFormSubmit', handleVoiceFormSubmit);
    
    return () => {
      window.removeEventListener('voiceFormUpdate', handleVoiceFormUpdate as EventListener);
      window.removeEventListener('voiceFormSubmit', handleVoiceFormSubmit);
    };
  }, []);

  const loadInitialData = () => {
    const sampleForms: FormData[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Need help with AI integration for our customer service platform.',
        category: 'technical',
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Question about pricing plans and enterprise features.',
        category: 'billing',
        priority: 'medium',
        status: 'processing',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        message: 'Request for API documentation and integration examples.',
        category: 'support',
        priority: 'low',
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    setForms(sampleForms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update existing form
        setForms(forms.map(form => 
          form.id === editingId 
            ? { ...form, ...currentForm } as FormData
            : form
        ));
        setEditingId(null);
      } else {
        // Create new form
        const newForm: FormData = {
          id: Date.now().toString(),
          ...currentForm as FormData,
          createdAt: new Date().toISOString()
        };
        setForms([newForm, ...forms]);
      }

      // Reset form
      resetForm();

      // Submit to backend
      await fetch('http://localhost:8000/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentForm),
      }).catch(() => {
        console.log('Backend not available, using local storage');
      });

    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentForm({
      name: '',
      email: '',
      message: '',
      category: 'general',
      priority: 'medium',
      status: 'pending'
    });
  };

  const handleEdit = (form: FormData) => {
    setCurrentForm(form);
    setEditingId(form.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      setForms(forms.filter(form => form.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: FormData['status']) => {
    setForms(forms.map(form => 
      form.id === id ? { ...form, status } : form
    ));
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete all forms?')) {
      setForms([]);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredAndSortedForms, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `forms_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          if (Array.isArray(importedData)) {
            setForms([...forms, ...importedData]);
            alert(`Successfully imported ${importedData.length} forms`);
          } else {
            alert('Invalid file format');
          }
        } catch (error) {
          alert('Error reading file');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleRefresh = () => {
    loadInitialData();
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPriority('all');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const filteredAndSortedForms = forms
    .filter(form => {
      const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           form.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           form.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || form.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof FormData];
      let bValue = b[sortBy as keyof FormData];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={currentForm.name || ''}
              onChange={(e) => setCurrentForm({ ...currentForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={currentForm.email || ''}
              onChange={(e) => setCurrentForm({ ...currentForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            value={currentForm.message || ''}
            onChange={(e) => setCurrentForm({ ...currentForm, message: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={currentForm.category || 'general'}
              onChange={(e) => setCurrentForm({ ...currentForm, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="support">Support</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={currentForm.priority || 'medium'}
              onChange={(e) => setCurrentForm({ ...currentForm, priority: e.target.value as FormData['priority'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={currentForm.status || 'pending'}
              onChange={(e) => setCurrentForm({ ...currentForm, status: e.target.value as FormData['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Save'}</span>
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                resetForm();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </form>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Forms ({filteredAndSortedForms.length})
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <label className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleExport}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            {forms.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="name">Name</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Form List */}
      <div className="space-y-4">
        {filteredAndSortedForms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {forms.length === 0 ? 'No forms submitted yet.' : 'No forms match your search criteria.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedForms.map((form) => (
              <div key={form.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{form.name}</h4>
                      <span className="text-sm text-gray-600">{form.email}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(form.priority)}`}>
                        {form.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(form.status)}`}>
                        {form.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{form.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {form.category}</span>
                      <span>Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={form.status}
                      onChange={(e) => handleStatusChange(form.id, e.target.value as FormData['status'])}
                      className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleEdit(form)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit Form"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(form.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormManager;