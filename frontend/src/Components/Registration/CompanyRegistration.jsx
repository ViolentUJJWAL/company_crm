import React, { useState } from "react";
const CompanyRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    companyEmail: "",
    phoneNo: "",
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
      formDataToSend.append("name", formData.name);
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("companyEmail", formData.companyEmail);
      formDataToSend.append("phoneNo", formData.phoneNo);
      formDataToSend.append("companyPhoneNo", formData.companyPhoneNo);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("industry", formData.industry);
      formDataToSend.append("address", JSON.stringify(formData.address));
      formDataToSend.append("image", formData.image);

      //   const response = await axios.post(
      //     "/api/company/register",
      //     formDataToSend,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     }
      //   );

      //   if (response.status === 201) {
      //     setSuccess("Company registered successfully!");
      //     setFormData({
      //       name: "",
      //       companyName: "",
      //       email: "",
      //       companyEmail: "",
      //       phoneNo: "",
      //       companyPhoneNo: "",
      //       password: "",
      //       industry: "",
      //       address: {
      //         country: "",
      //         state: "",
      //         city: "",
      //         pincode: "",
      //       },
      //       image: null,
      //     });
      //   }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again."
      );
    }
  };

  const InputField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = true,
  }) => (
    <div className="flex-1 min-w-[250px]">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
        required={required}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-3xl font-bold text-white text-center">
              Register Your Company
            </h2>
            <p className="mt-2 text-blue-100 text-center">
              Fill in the details below to create your company account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-center">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Owner Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <InputField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Owner Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Company Email"
                name="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Owner Phone Number"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
              />
              <InputField
                label="Company Phone Number"
                name="companyPhoneNo"
                value={formData.companyPhoneNo}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputField
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                />
                <InputField
                  label="State"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <InputField
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                />
                <InputField
                  label="Pincode"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
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
