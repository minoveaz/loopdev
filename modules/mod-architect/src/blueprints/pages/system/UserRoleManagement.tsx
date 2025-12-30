
import React from 'react';
import { SectionHeader, Button, Badge } from '@blueprints/components/ui/DesignSystem';

export const UserRoleManagement: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <SectionHeader 
        title="User & Role Management" 
        subtitle="Manage user access, define role-based permissions, and handle team invitations."
        context="Identity & Access"
      />

      {/* User Cards Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Team Members</h2>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" icon={<span className="material-symbols-outlined text-[18px]">filter_list</span>}>
              Filter
            </Button>
            <Button size="sm" icon={<span className="material-symbols-outlined text-[18px]">add</span>}>
              Add User
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active User Card */}
          <div className="group relative bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-xl"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-300 border-2 border-white dark:border-slate-600 shadow-sm">
                  EL
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-surface-dark" title="Active"></div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
                <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-[#0d121b] dark:text-white font-bold text-lg">Elena Lois</h3>
              <p className="text-slate-500 text-sm">elena.lois@loop.dev</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="primary">Admin</Badge>
              <Badge variant="neutral">Engineering</Badge>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <span>Last active: 2m ago</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">vpn_key</span> 2FA On</span>
            </div>
          </div>

          {/* Away User Card */}
          <div className="group relative bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-energy"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-300 border-2 border-white dark:border-slate-600 shadow-sm">
                  MJ
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-energy rounded-full border-2 border-white dark:border-surface-dark" title="Away"></div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-[#0d121b] dark:text-white font-bold text-lg">Marcus Jones</h3>
              <p className="text-slate-500 text-sm">marcus.j@loop.dev</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="energy">Editor</Badge>
              <Badge variant="neutral">Design</Badge>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <span>Last active: 4h ago</span>
              <span className="flex items-center gap-1 text-slate-300 dark:text-slate-600"><span className="material-symbols-outlined text-xs">vpn_key_off</span> 2FA Off</span>
            </div>
          </div>

          {/* Pending User Card */}
          <div className="group relative bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 flex flex-col justify-center items-center text-center hover:bg-white dark:hover:bg-surface-dark hover:border-solid hover:border-slate-200 dark:hover:border-slate-600 transition-all">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-500 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">person_add</span>
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Invite Team Member</h3>
            <p className="text-slate-500 text-sm mb-4">Add a new user to this workspace.</p>
            <Button variant="outline" size="sm">Send Invite</Button>
          </div>
        </div>
      </section>

      {/* Roles & Permissions */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Roles & Permissions</h2>
        </div>
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[400px]">
          {/* Roles List */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4 flex flex-col gap-2">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-sm flex items-center justify-between cursor-pointer ring-1 ring-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <div>
                  <div className="text-sm font-bold text-[#0d121b] dark:text-white">Administrator</div>
                  <div className="text-xs text-slate-500">Full system access</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-sm">chevron_right</span>
            </div>
            <div className="p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-energy"></div>
                <div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-[#0d121b] dark:group-hover:text-white">Editor</div>
                  <div className="text-xs text-slate-500">Content management</div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                <div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-[#0d121b] dark:group-hover:text-white">Viewer</div>
                  <div className="text-xs text-slate-500">Read-only access</div>
                </div>
              </div>
            </div>
            <button className="mt-auto flex items-center gap-2 text-primary text-xs font-bold px-2 hover:underline">
              <span className="material-symbols-outlined text-sm">add_circle</span> Create Custom Role
            </button>
          </div>

          {/* Permissions Panel */}
          <div className="w-full md:w-2/3 p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Administrator Permissions</h3>
                <p className="text-sm text-slate-500">Managing access level for admin users.</p>
              </div>
              <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">Active Role</span>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'User Management', desc: 'Create, edit, and delete user accounts.', active: true },
                { title: 'Billing & Subscription', desc: 'Manage payment methods and plans.', active: true },
                { title: 'System Logs', desc: 'View detailed audit logs and history.', active: true },
                { title: 'API Key Management', desc: 'Generate and revoke API keys.', active: false },
                { title: 'Root Access', desc: 'Permanent deletion of organization data.', active: false, disabled: true }
              ].map((perm, i) => (
                <div key={i} className={`flex items-center justify-between py-1 ${perm.disabled ? 'opacity-50' : ''}`}>
                  <div>
                    <p className="text-sm font-medium text-[#0d121b] dark:text-white">{perm.title}</p>
                    <p className="text-xs text-slate-500">{perm.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={perm.active} disabled={perm.disabled} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Invitation Flow */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Invitations</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-[#0d121b] dark:text-white mb-4">Invite New User</h3>
            <form className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase" htmlFor="email">Email Address</label>
                <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white px-3 py-2.5 outline-none border focus:ring-1 transition-all" id="email" placeholder="colleague@company.com" type="email"/>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase" htmlFor="role">Assign Role</label>
                <div className="relative">
                  <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white px-3 py-2.5 outline-none border focus:ring-1 transition-all appearance-none" id="role">
                    <option>Editor</option>
                    <option>Viewer</option>
                    <option>Administrator</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="flex items-start gap-2 py-2">
                <input className="rounded border-slate-300 text-primary focus:ring-primary mt-1" id="notify" type="checkbox" defaultChecked/>
                <label className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer" htmlFor="notify">
                  Send a welcome email with onboarding guide.
                </label>
              </div>
              <Button className="w-full justify-center mt-2" icon={<span className="material-symbols-outlined text-[18px]">send</span>}>
                Send Invitation
              </Button>
            </form>
          </div>

          {/* Pending List */}
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
              <h3 className="font-bold text-[#0d121b] dark:text-white">Pending Invitations</h3>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-primary px-2 py-0.5 rounded text-xs font-bold">3 Pending</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                { email: 'david.chen@loop.dev', role: 'Editor', time: '2 hours ago', status: 'Pending' },
                { email: 'sarah.k@loop.dev', role: 'Viewer', time: '1 day ago', status: 'Pending' },
              ].map((invite, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0d121b] dark:text-white">{invite.email}</p>
                      <p className="text-xs text-slate-500">Role: <span className="text-slate-700 dark:text-slate-300 font-medium">{invite.role}</span> • Sent {invite.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-xs text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Pending
                    </span>
                    <div className="flex gap-1">
                      <button className="text-slate-400 hover:text-primary p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Resend">
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                      </button>
                      <button className="text-slate-400 hover:text-red-500 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Revoke">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Expired Item */}
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-75">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0d121b] dark:text-white">alex.t@loop.dev</p>
                    <p className="text-xs text-slate-500">Role: <span className="text-slate-700 dark:text-slate-300 font-medium">Admin</span> • Expired</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Expired
                  </span>
                  <button className="text-primary hover:text-blue-700 dark:hover:text-blue-400 p-1 rounded font-bold text-xs">
                    Renew Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
