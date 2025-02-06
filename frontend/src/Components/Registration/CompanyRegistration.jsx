import React, { useState } from "react";
import { Camera } from "lucide-react";
import authServices from "../../services/authServices";

const CompanyRegistration = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    companyName: "",
    ownerEmail: "",
    companyEmail: "",
    ownerPhoneNo: "",
    companyPhoneNo: "",
    password: "",
    industry: "",
    address: {
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    image: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSection, setActiveSection] = useState("personal");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "address") {
          for (const subKey in formData[key]) {
            formDataToSend.append(`address[${subKey}]`, formData[key][subKey]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await authServices.registerCompany(formDataToSend);
      console.log("response", response);
      if (response.message) {
        setSuccess("Company registered successfully!");
        setFormData({
          ownerName: "",
          companyName: "",
          ownerEmail: "",
          companyEmail: "",
          ownerPhoneNo: "",
          companyPhoneNo: "",
          password: "",
          industry: "",
          address: {
            country: "",
            state: "",
            city: "",
            pincode: "",
          },
          image: null,
        });
      }
    } catch (err) {
      setError(err.message || "Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          <div className="relative px-6 py-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-black opacity-10" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white text-center">
                Register Your Company
              </h2>
              <p className="mt-3 text-blue-100 text-center text-lg">
                Join our business community and start your journey
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4 px-6">
            <button
              type="button"
              onClick={() => setActiveSection("personal")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeSection === "personal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Personal Details
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("company")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeSection === "company"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Company Details
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center animate-fade-in">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-xl text-center animate-fade-in">
                {success}
              </div>
            )}

            <div
              className={`space-y-8 ${
                activeSection === "personal" ? "block" : "hidden"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="ownerName"
                  placeholder="Owner Name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="email"
                  name="ownerEmail"
                  placeholder="Owner Email"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="text"
                  name="ownerPhoneNo"
                  placeholder="Owner Phone Number"
                  value={formData.ownerPhoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
              </div>
            </div>

            <div
              className={`space-y-8 ${
                activeSection === "company" ? "block" : "hidden"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="email"
                  name="companyEmail"
                  placeholder="Company Email"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="text"
                  name="companyPhoneNo"
                  placeholder="Company Phone Number"
                  value={formData.companyPhoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="text"
                  name="industry"
                  placeholder="Industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="address.country"
                  placeholder="Country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="text"
                  name="address.state"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
                <input
                  type="text"
                  name="address.pincode"
                  placeholder="Pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 hover:bg-gray-100"
                  required
                />
              </div>

              <div className="relative group">
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="hidden"
                  id="company-logo"
                  required
                />
                <label
                  htmlFor="company-logo"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors duration-200"
                >
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      Upload Company Logo
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={`${
                activeSection === "company" ? "block" : "hidden"
              } w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
            >
              Register Company
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
