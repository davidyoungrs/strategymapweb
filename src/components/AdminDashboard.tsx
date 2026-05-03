import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { UserProfile, CanvasData } from '../types';
import { Users, Star, FolderOpen, ChevronDown, ChevronRight, Layout, Zap, Network, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminDashboard({ onBack, profile, onOpenCanvas }: { 
  onBack: () => void, 
  profile: UserProfile | null,
  onOpenCanvas: (canvas: CanvasData) => void 
}) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [canvases, setCanvases] = useState<CanvasData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  // ... (keeping lines 14-156 unchanged)
  useEffect(() => {
    async function fetchData() {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersList = usersSnap.docs.map(doc => doc.data() as UserProfile);
        setUsers(usersList);

        const canvasesSnap = await getDocs(query(collection(db, 'canvases'), orderBy('updatedAt', 'desc')));
        const canvasesList = canvasesSnap.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as CanvasData));
        setCanvases(canvasesList);
      } catch (error) {
        console.error('Error fetchData:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleUser = (uid: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(uid)) {
      newExpanded.delete(uid);
    } else {
      newExpanded.add(uid);
    }
    setExpandedUsers(newExpanded);
  };

  if (!profile || profile.email !== 'david.young@reallysimpleapps.com') {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase mb-2">Access Restricted</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
          You do not have administrative privileges to view this dashboard. Please contact the system administrator if you believe this is an error.
        </p>
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          Return to App
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-zinc-50 dark:bg-zinc-900/50 relative">
      <div className="p-10 max-w-6xl mx-auto pb-32">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase mb-2">Admin Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-widest uppercase text-xs">Registered Users & Projects</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </button>
        </div>

      <div className="grid gap-4">
        {users.map((user) => {
          const userCanvases = canvases.filter(c => c.userId === user.uid);
          const isExpanded = expandedUsers.has(user.uid);

          return (
            <div 
              key={user.uid} 
              className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div 
                className={cn(
                  "p-6 flex items-center justify-between cursor-pointer",
                  isExpanded && "border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20"
                )}
                onClick={() => toggleUser(user.uid)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                      {user.displayName || 'Unnamed User'}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {user.isPaidTier ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800/50">
                        <Star className="w-3 h-3 fill-current" />
                        Premium
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-800">
                        Free
                      </div>
                    )}
                  </div>

                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Plans</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{userCanvases.length}</p>
                  </div>

                  <div className="text-zinc-400">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 bg-zinc-50/30 dark:bg-black/20">
                  {userCanvases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userCanvases.map((canvas) => (
                        <div 
                          key={canvas.id}
                          className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-3 group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate pr-4">
                              {canvas.title}
                            </h4>
                            <FolderOpen className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-500 rounded border border-zinc-200 dark:border-zinc-800">
                              <Layout className="w-2.5 h-2.5" /> Canvas
                            </div>
                            {canvas.strategyMap && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-[10px] font-bold text-blue-600 rounded border border-blue-100 dark:border-blue-800/50">
                                <Network className="w-2.5 h-2.5" /> Map
                              </div>
                            )}
                            {canvas.swot && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-[10px] font-bold text-purple-600 rounded border border-purple-100 dark:border-purple-800/50">
                                <Zap className="w-2.5 h-2.5" /> SWOT
                              </div>
                            )}
                          </div>

                          <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
                              Updated {canvas.updatedAt?.toDate().toLocaleDateString()}
                            </span>
                            <button 
                              onClick={() => onOpenCanvas(canvas)}
                              className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              View Project
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-xl">
                      <FolderOpen className="w-8 h-8 text-zinc-200 dark:text-zinc-800 mx-auto mb-2" />
                      <p className="text-xs text-zinc-400 font-medium">No saved plans yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
}

