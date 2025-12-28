import React, { useState, useEffect } from 'react';
import { Host } from '../types/index';

interface HostFormProps {
  initialData?: Host | null;
  onSave: (host: Host) => void;
  onCancel: () => void;
}

const HostForm: React.FC<HostFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Host>({
    id: crypto.randomUUID(),
    label: '',
    hostname: '',
    port: 22,
    username: '',
    authType: 'password',
    password: '',
    keyPath: '',
    group: 'Default',
    tags: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) || 22 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto border border-neutral-700">
      <h2 className="text-2xl font-bold text-white mb-6">
        {initialData ? 'Edit Host' : 'New Host'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Label</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="My Web Server"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-neutral-600"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Hostname / IP</label>
            <input
              type="text"
              name="hostname"
              value={formData.hostname}
              onChange={handleChange}
              placeholder="192.168.1.1"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-neutral-600 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Port</label>
            <input
              type="number"
              name="port"
              value={formData.port}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-neutral-600 font-mono"
            />
          </div>
        </div>

        <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="root"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-neutral-600 font-mono"
              required
            />
        </div>

        <div>
           <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Auth Type</label>
           <div className="flex gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-700">
               {['password', 'key', 'agent'].map(type => (
                   <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, authType: type as any }))}
                        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            formData.authType === type 
                            ? 'bg-neutral-700 text-white shadow-sm' 
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                   >
                       {type.charAt(0).toUpperCase() + type.slice(1)}
                   </button>
               ))}
           </div>
        </div>

        {formData.authType === 'password' && (
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-neutral-600 font-mono"
            />
          </div>
        )}

        {formData.authType === 'key' && (
           <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Private Key Path</label>
            <input
              type="text"
              name="keyPath"
              value={formData.keyPath || ''}
              onChange={handleChange}
              placeholder="~/.ssh/id_rsa"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-neutral-600 font-mono"
            />
          </div>
        )}

        <div className="flex gap-3 mt-8 pt-4 border-t border-neutral-700">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-900/40 transition-all font-medium"
          >
            Save Host
          </button>
        </div>
      </form>
    </div>
  );
};

export default HostForm;
