import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import { FiUser, FiMapPin, FiGlobe, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

const API_BASE = import.meta.env.VITE_API_BASE

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', language: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { t, currentLanguage, availableLanguages } = useTranslation();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError(t('profile.notFound', 'User not found. Please register again.'));
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get(`${API_BASE}/api/users/${userId}`)
      .then(res => {
        setUser(res.data);
        setForm({
          name: res.data.name,
          location: res.data.location,
          language: res.data.language
        });
        setLoading(false);
      })
      .catch(() => {
        setError(t('profile.error', 'Could not fetch profile. Try again later.'));
        setLoading(false);
      });
  }, [userId, t, currentLanguage]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await axios.put(`${API_BASE}/api/users/${userId}`, form);
      setUser(res.data);
      setEditMode(false);
    } catch (e) {
      setError(t('profile.updateError', 'Update failed. Please try again.'));
    }
    setSaving(false);
  };

  // Get language name in current language
  const getLangLabel = code => t(`profile.languageMap.${code}`, code);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
      <Header userData={user} />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto bg-slate-800/90 px-8 py-10 rounded-2xl shadow-2xl border border-green-700">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent mb-8 tracking-tight">
            {t('profile.title', 'Profile')}
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 rounded px-3 py-2 mb-4">
              {error}
            </div>
          )}

          {!editMode ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4 bg-slate-700 p-5 rounded-lg border border-green-600">
                <div className="p-3 bg-green-700 rounded-full"><FiUser className="text-2xl text-white" /></div>
                <div>
                  <div className="text-base text-gray-400">{t('profile.nameLabel', 'Name')}</div>
                  <div className="text-lg font-semibold text-green-200">{user?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700 p-5 rounded-lg border border-green-600">
                <div className="p-3 bg-green-700 rounded-full"><FiMapPin className="text-2xl text-white" /></div>
                <div>
                  <div className="text-base text-gray-400">{t('profile.locationLabel', 'Location')}</div>
                  <div className="text-lg font-semibold text-green-200">{user?.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700 p-5 rounded-lg border border-green-600">
                <div className="p-3 bg-green-700 rounded-full"><FiGlobe className="text-2xl text-white" /></div>
                <div>
                  <div className="text-base text-gray-400">{t('profile.languageLabel', 'Language')}</div>
                  <div className="text-lg font-semibold text-green-200">
                    {getLangLabel(user?.language)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-8">
              <div className="flex items-center gap-4 bg-slate-700 p-5 rounded-lg border border-green-600">
                <div className="p-3 bg-green-700 rounded-full"><FiUser className="text-2xl text-white" /></div>
                <div className="flex-1">
                  <div className="text-base text-gray-400">{t('profile.nameLabel', 'Name')}</div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded border border-green-400 bg-slate-800 text-green-100 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700 p-5 rounded-lg border border-green-600">
                <div className="p-3 bg-green-700 rounded-full"><FiMapPin className="text-2xl text-white" /></div>
                <div className="flex-1">
                  <div className="text-base text-gray-400">{t('profile.locationLabel', 'Location')}</div>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded border border-green-400 bg-slate-800 text-green-100 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700 p-5 rounded-lg border border-green-600">
                <div className="p-3 bg-green-700 rounded-full"><FiGlobe className="text-2xl text-white" /></div>
                <div className="flex-1">
                  <div className="text-base text-gray-400">{t('profile.languageLabel', 'Language')}</div>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded border border-green-400 bg-slate-800 text-green-100 focus:ring-2 focus:ring-green-500"
                  >
                    {availableLanguages.map(lang =>
                      <option key={lang.code} value={lang.code}>
                        {getLangLabel(lang.code)}
                      </option>
                    )}
                  </select>
                </div>
              </div>
            </form>
          )}

          <div className="mt-8 flex justify-center gap-3">
            {!editMode ? (
              <button
                className="inline-flex items-center gap-2 px-6 py-2 rounded bg-gradient-to-tr from-green-600 to-emerald-700 text-white font-semibold hover:from-green-700 hover:to-emerald-800 shadow-lg transition"
                onClick={() => setEditMode(true)}
              >
                <FiEdit3 /> {t('profile.edit', 'Edit')}
              </button>
            ) : (
              <>
                <button
                  className="inline-flex items-center gap-2 px-6 py-2 rounded bg-gradient-to-tr from-green-600 to-emerald-700 text-white font-semibold hover:from-green-700 hover:to-emerald-800 shadow-lg transition"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FiSave /> {saving ? t('profile.save', 'Saving...') : t('profile.save', 'Save')}
                </button>
                <button
                  className="inline-flex items-center gap-2 px-6 py-2 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700 shadow-lg transition"
                  onClick={() => {
                    setForm({ name: user.name, location: user.location, language: user.language });
                    setEditMode(false);
                  }}
                  disabled={saving}
                >
                  <FiX /> {t('profile.cancel', 'Cancel')}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
