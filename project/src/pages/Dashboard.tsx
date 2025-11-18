import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Assessment, Profile } from '../lib/supabase';
import {
  Brain,
  Plus,
  TrendingUp,
  Calendar,
  LogOut,
  History,
  Sparkles,
  AlertTriangle,
  Heart,
  User,
  X,
  Save,
  Phone,
  Mail,
  MapPin,
  Edit,
  UserCircle,
} from 'lucide-react';

interface DashboardProps {
  onStartAssessment: () => void;
  onViewResults: (assessmentId: string) => void;
}

export default function Dashboard({ onStartAssessment, onViewResults }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    full_name: '',
    phone_number: '',
    gender: '' as 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '',
    date_of_birth: '',
    bio: '',
    location: '',
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [profileResult, assessmentsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
        supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data);
        setProfileForm({
          username: profileResult.data.username || '',
          full_name: profileResult.data.full_name || '',
          phone_number: profileResult.data.phone_number || '',
          gender: profileResult.data.gender || '',
          date_of_birth: profileResult.data.date_of_birth || '',
          bio: profileResult.data.bio || '',
          location: profileResult.data.location || '',
        });
      }

      if (assessmentsResult.data) {
        setAssessments(assessmentsResult.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSavingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: profileForm.username,
          full_name: profileForm.full_name || null,
          phone_number: profileForm.phone_number || null,
          gender: profileForm.gender || null,
          date_of_birth: profileForm.date_of_birth || null,
          bio: profileForm.bio || null,
          location: profileForm.location || null,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setEditingProfile(false);
        setShowProfileModal(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
    setSavingProfile(false);
  };

  const handleOpenProfile = () => {
    setShowProfileModal(true);
    // If profile doesn't have much data, allow editing immediately
    if (!profile?.full_name && !profile?.phone_number) {
      setEditingProfile(true);
    } else {
      setEditingProfile(false);
    }
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setProfileForm({
        username: profile.username || '',
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        gender: profile.gender || '',
        date_of_birth: profile.date_of_birth || '',
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
    setEditingProfile(false);
  };

  const getScoreColor = (score: number) => {
    if (score < 4) return 'text-red-600 bg-red-50';
    if (score <= 8) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getScoreIcon = (score: number) => {
    if (score < 4) return <AlertTriangle className="w-5 h-5" />;
    if (score <= 8) return <TrendingUp className="w-5 h-5" />;
    return <Heart className="w-5 h-5" />;
  };

  const getScoreLabel = (score: number) => {
    if (score < 4) return 'Needs Attention';
    if (score <= 8) return 'Moderate';
    return 'Excellent';
  };

  const latestAssessment = assessments[0];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Floating Brain Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Brain className="absolute top-32 left-10 w-28 h-28 opacity-10 text-blue-600 floating-brain" />
        <Brain className="absolute bottom-40 right-16 w-24 h-24 opacity-10 text-purple-600 floating-brain-fast" style={{ animationDelay: '1s' }} />
        <Brain className="absolute top-1/2 right-1/4 w-20 h-20 opacity-10 text-cyan-500 floating-brain" style={{ animationDelay: '2.5s' }} />
      </div>

      <header className="relative z-50 bg-white shadow-md sticky top-0 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Mindful Log
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Welcome back, {profile?.full_name || profile?.username || 'User'}!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenProfile}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <User className="w-5 h-5" />
                Profile
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <Sparkles className="w-14 h-14 mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold mb-3">Ready for a Check-in?</h2>
              <p className="text-white/90 mb-6 text-lg leading-relaxed">
                Take a few minutes to assess your current mental wellness. Get personalized insights and recommendations.
              </p>
              <button
                onClick={onStartAssessment}
                className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Start New Assessment
              </button>
            </div>
          </div>

          {latestAssessment && (
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Latest Assessment</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${getScoreColor(latestAssessment.score)} shadow-lg`}>
                      {getScoreIcon(latestAssessment.score)}
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-gray-900">
                        {latestAssessment.score}/10
                      </div>
                      <p className="text-base text-gray-700 font-semibold">{getScoreLabel(latestAssessment.score)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 p-3 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {new Date(latestAssessment.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <button
                  onClick={() => onViewResults(latestAssessment.id)}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View Full Report
                </button>
              </div>
            </div>
          )}

          {!latestAssessment && (
            <div className="bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="bg-blue-100 p-6 rounded-full mb-6">
                <Brain className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Assessments Yet</h3>
              <p className="text-gray-700 text-lg mb-6 font-medium">
                Take your first assessment to begin tracking your mental wellness journey.
              </p>
            </div>
          )}
        </div>

        {assessments.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 p-2 rounded-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Assessment History</h2>
            </div>

            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:scale-[1.01]"
                  onClick={() => onViewResults(assessment.id)}
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-xl ${getScoreColor(assessment.score)} shadow-lg`}>
                      {getScoreIcon(assessment.score)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        Score: {assessment.score}/10 - {getScoreLabel(assessment.score)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mt-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {new Date(assessment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-blue-600 font-bold text-lg">View Details →</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Heart className="w-6 h-6 text-cyan-600" />
            Remember
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed font-medium">
            Regular self-assessment is an important part of maintaining mental wellness. These assessments are tools to help you understand your emotional state, but they are not a substitute for professional mental health care. If you're struggling, please reach out to your college counseling services.
          </p>
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          style={{ willChange: 'opacity' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfileModal(false);
              setEditingProfile(false);
              handleCancelEdit();
            }
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            style={{ transform: 'translateZ(0)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-blue-700 px-6 py-5 flex items-center justify-between z-10">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <UserCircle className="w-8 h-8" />
                Profile
              </h2>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setEditingProfile(false);
                  handleCancelEdit();
                }}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6 bg-gray-50 overflow-y-auto flex-1">
              {!editingProfile ? (
                <>
                  {/* View Mode */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                      <button
                        onClick={handleEditProfile}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-bold"
                      >
                        <Edit className="w-5 h-5" />
                        Edit Profile
                      </button>
                    </div>

                    {!profile && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-blue-800 text-sm">
                          Complete your profile to personalize your experience.
                        </p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                        <p className="text-gray-900 font-semibold text-lg">{profile?.username || 'Not set'}</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                          <Mail className="w-4 h-4 text-blue-600" />
                          Email
                        </label>
                        <p className="text-gray-900 font-semibold text-lg">{user?.email || 'Not available'}</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <p className="text-gray-900 font-semibold text-lg">{profile?.full_name || 'Not set'}</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                          <Phone className="w-4 h-4 text-blue-600" />
                          Phone Number
                        </label>
                        <p className="text-gray-900 font-semibold text-lg">{profile?.phone_number || 'Not set'}</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                        <p className="text-gray-900 font-semibold text-lg">{profile?.gender || 'Not set'}</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                        <p className="text-gray-900 font-semibold text-lg">
                          {profile?.date_of_birth
                            ? new Date(profile.date_of_birth).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : 'Not set'}
                        </p>
                      </div>

                      <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          Location
                        </label>
                        <p className="text-gray-900 font-semibold text-lg">{profile?.location || 'Not set'}</p>
                      </div>

                      <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                        <p className="text-gray-900 font-medium text-base whitespace-pre-wrap leading-relaxed">{profile?.bio || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <div className="space-y-5">
                    <h3 className="text-2xl font-bold text-gray-900">Edit Personal Information</h3>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="username" className="block text-sm font-bold text-gray-800 mb-2">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none bg-white font-medium text-gray-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                          <Mail className="w-4 h-4 text-blue-600" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
                        />
                        <p className="text-xs text-gray-600 mt-1 font-medium">Email cannot be changed here</p>
                      </div>

                      <div>
                        <label htmlFor="full_name" className="block text-sm font-bold text-gray-800 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none bg-white font-medium text-gray-900"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone_number" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                          <Phone className="w-4 h-4 text-blue-600" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone_number"
                          value={profileForm.phone_number}
                          onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none bg-white font-medium text-gray-900"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label htmlFor="gender" className="block text-sm font-bold text-gray-800 mb-2">
                          Gender
                        </label>
                        <select
                          id="gender"
                          value={profileForm.gender}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              gender: e.target.value as 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '',
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none bg-white font-medium text-gray-900"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="date_of_birth" className="block text-sm font-bold text-gray-800 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="date_of_birth"
                          value={profileForm.date_of_birth}
                          onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none bg-white font-medium text-gray-900"
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="location" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none bg-white font-medium text-gray-900"
                          placeholder="City, State, Country"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-bold text-gray-800 mb-2">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none resize-none bg-white font-medium text-gray-900"
                          placeholder="Tell us a little about yourself..."
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-600 mt-2 font-medium">{profileForm.bio.length}/500 characters</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile || !profileForm.username.trim()}
                      className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5" />
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={savingProfile}
                      className="px-8 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
