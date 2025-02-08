import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const navigate = useNavigate();

    const settingsGroups = [
      {
        title: "Lead Settings",
        description: "Recent and commonly used settings",
        link: "/lead-settings",
        settings: [
          { icon: "📦", title: "Lead For", link: "/lead-for" },
          { icon: "⚫", title: "Lead Source", link: "/lead-source" },
          { icon: "💻", title: "Lead Status", link: "/lead-status" },
        ],
      },
      {
        title: "System settings",
        description: "Manage system preferences",
        link: "/system-settings",
        settings: [
          { icon: "🔋", title: "Battery", link: "/battery" },
          { icon: "🌐", title: "Network & Internet", link: "/network" },
          { icon: "🔊", title: "Sound", link: "/sound" },
        ],
      },
      {
        title: "Privacy & Security",
        description: "Control your privacy settings",
        link: "/privacy-security",
        settings: [
          { icon: "🔒", title: "Security", link: "/security" },
          { icon: "🛡️", title: "Privacy Dashboard", link: "/privacy-dashboard" },
          { icon: "📍", title: "Location Services", link: "/location-services" },
        ],
      },
    ];
  
    return (
      <div className="bg-gray-100 flex flex-wrap gap-4 p-4">
        {settingsGroups.map((group, index) => (
          <div key={index} className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
            <h2
              className="text-lg font-semibold mb-2 cursor-pointer text-blue-600 hover:underline"
              onClick={() => navigate(group.link)}
            >
              {group.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4">{group.description}</p>
            <div className="space-y-2">
              {group.settings.map((setting, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => navigate(setting.link)}
                >
                  <span className="text-lg mr-3">{setting.icon}</span>
                  <span className="text-gray-800">{setting.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
}
