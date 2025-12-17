import React from 'react';
import { User, Mail, Shield } from 'lucide-react';

const UserProfile = () => {
  // Mock Data
  const user = {
    name: "Choirunnisa",
    email: "choirunnisa@student.itera.ac.id",
    role: "User",
    joinDate: "10 Oktober 2024"
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg border border-slate-100 overflow-hidden h-fit">
            <div className="bg-blue-600 h-32 w-full relative"></div>
            
            <div className="px-8 pb-8 text-center relative">
                <div className="w-24 h-24 bg-white p-1 rounded-full mx-auto -mt-12 mb-4 shadow-md">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 font-outfit">{user.name}</h2>
                <p className="text-slate-500 text-sm mb-6">Member sejak {user.joinDate}</p>

                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Mail size={20}/></div>
                        <div>
                            <p className="text-xs text-slate-400">Email Address</p>
                            <p className="font-medium text-slate-700">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Shield size={20}/></div>
                        <div>
                            <p className="text-xs text-slate-400">Account Status</p>
                            <p className="font-medium text-slate-700">{user.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;