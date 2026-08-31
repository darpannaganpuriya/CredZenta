import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, Building2, FileText, DollarSign, BarChart2, Home, Upload, Eye } from "lucide-react";
import { cn } from "../lib/utils";

// ─── Form schemas ─────────────────────────────────────────────────
const step1Schema = z.object({
  applicantName: z.string().min(2, "Name required"),
  designation: z.string().min(1, "Designation required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
});

const step2Schema = z.object({
  businessName: z.string().min(2, "Business name required"),
  businessType: z.enum(["Private Limited", "Public Limited", "Partnership", "Proprietorship", "LLP", "Society", "Trust"]),
  industry: z.string().min(1, "Industry required"),
  gstin: z.string().min(15, "Valid GSTIN required"),
  cin: z.string().optional(),
  incorporationDate: z.string().min(1, "Required"),
  businessVintage: z.number().min(0),
  location: z.string().min(1, "Location required"),
});

const step3Schema = z.object({
  loanType: z.enum(["Working Capital", "Term Loan", "Overdraft", "Letter of Credit", "Bank Guarantee", "Machinery Loan", "Home Loan", "LAP"]),
  requestedAmount: z.number().min(100000, "Minimum ₹1 L"),
  tenure: z.number().min(1, "Minimum 1 month"),
  purpose: z.string().min(10, "Describe the loan purpose"),
});

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const STEPS = [
  { id: 1, label: "Applicant", icon: Building2 },
  { id: 2, label: "Business", icon: Building2 },
  { id: 3, label: "Loan Details", icon: DollarSign },
  { id: 4, label: "Financials", icon: BarChart2 },
  { id: 5, label: "Collateral", icon: Home },
  { id: 6, label: "Documents", icon: Upload },
  { id: 7, label: "Review", icon: Eye },
];

const industries = [
  "Manufacturing", "Agriculture & Food Processing", "FMCG", "Automotive",
  "Textiles", "Construction & Infrastructure", "Pharmaceuticals",
  "Steel & Metal", "Export & Import", "Wholesale Trade", "IT & Software",
  "Healthcare", "Education", "Retail", "Real Estate",
];

export function CreateApplicationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);

  type Step1 = z.infer<typeof step1Schema>;
  type Step2 = z.infer<typeof step2Schema>;
  type Step3 = z.infer<typeof step3Schema>;

  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema) });
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema) });

  const getForms = () => ({ 1: form1, 2: form2, 3: form3 });

  const handleNext = async () => {
    if (currentStep <= 3) {
      const form = getForms()[currentStep as 1 | 2 | 3];
      const valid = await form.trigger();
      if (!valid) return;
      setFormData((prev) => ({ ...prev, ...form.getValues() }));
    }
    setCurrentStep((s) => Math.min(s + 1, 7) as Step);
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    navigate("/applications");
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-medium text-slate-700 mb-1.5">{children}</label>
  );

  const Input = ({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) => (
    <div>
      <input
        {...props}
        className={cn(
          "w-full text-sm border rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors",
          error ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-brand-400"
        )}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  const Select = ({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) => (
    <div>
      <select
        {...props}
        className={cn(
          "w-full text-sm border rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors",
          error ? "border-red-300" : "border-slate-200 focus:border-brand-400"
        )}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/applications")}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">New Loan Application</h2>
          <p className="text-sm text-slate-500 mt-0.5">Complete all steps to submit the application</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="section-card p-5">
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                    currentStep > step.id
                      ? "bg-emerald-500 text-white"
                      : currentStep === step.id
                      ? "bg-brand-600 text-white shadow-md shadow-brand-200"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium mt-1 hidden sm:block",
                    currentStep === step.id ? "text-brand-600" : "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-1 transition-all", currentStep > step.id ? "bg-emerald-400" : "bg-slate-200")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="section-card p-6 animate-fade-in">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Applicant Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  placeholder="As per PAN card"
                  {...form1.register("applicantName")}
                  error={form1.formState.errors.applicantName?.message}
                />
              </div>
              <div>
                <Label>Designation *</Label>
                <Input
                  placeholder="e.g. Managing Director"
                  {...form1.register("designation")}
                  error={form1.formState.errors.designation?.message}
                />
              </div>
              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  placeholder="applicant@company.com"
                  {...form1.register("email")}
                  error={form1.formState.errors.email?.message}
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...form1.register("phone")}
                  error={form1.formState.errors.phone?.message}
                />
              </div>
              <div>
                <Label>PAN Number *</Label>
                <Input
                  placeholder="ABCDE1234F"
                  className="uppercase"
                  {...form1.register("pan")}
                  error={form1.formState.errors.pan?.message}
                />
              </div>
              <div>
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  {...form1.register("dateOfBirth")}
                  error={form1.formState.errors.dateOfBirth?.message}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Business Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Business Name *</Label>
                <Input
                  placeholder="Registered business name"
                  {...form2.register("businessName")}
                  error={form2.formState.errors.businessName?.message}
                />
              </div>
              <div>
                <Label>Business Type *</Label>
                <Select {...form2.register("businessType")} error={form2.formState.errors.businessType?.message}>
                  <option value="">Select type</option>
                  {["Private Limited", "Public Limited", "Partnership", "Proprietorship", "LLP", "Society", "Trust"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Industry *</Label>
                <Select {...form2.register("industry")} error={form2.formState.errors.industry?.message}>
                  <option value="">Select industry</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </Select>
              </div>
              <div>
                <Label>GSTIN *</Label>
                <Input
                  placeholder="22AAAAA0000A1Z5"
                  className="uppercase"
                  {...form2.register("gstin")}
                  error={form2.formState.errors.gstin?.message}
                />
              </div>
              <div>
                <Label>CIN (if applicable)</Label>
                <Input
                  placeholder="U28999MP2018PTC047832"
                  {...form2.register("cin")}
                />
              </div>
              <div>
                <Label>Date of Incorporation *</Label>
                <Input
                  type="date"
                  {...form2.register("incorporationDate")}
                  error={form2.formState.errors.incorporationDate?.message}
                />
              </div>
              <div>
                <Label>Business Vintage (Years) *</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 8"
                  {...form2.register("businessVintage", { valueAsNumber: true })}
                  error={form2.formState.errors.businessVintage?.message}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Location *</Label>
                <Input
                  placeholder="City, State"
                  {...form2.register("location")}
                  error={form2.formState.errors.location?.message}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Loan Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Loan Type *</Label>
                <Select {...form3.register("loanType")} error={form3.formState.errors.loanType?.message}>
                  <option value="">Select loan type</option>
                  {["Working Capital", "Term Loan", "Overdraft", "Letter of Credit", "Bank Guarantee", "Machinery Loan", "Home Loan", "LAP"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Requested Amount (₹) *</Label>
                <Input
                  type="number"
                  min={100000}
                  placeholder="e.g. 5000000"
                  {...form3.register("requestedAmount", { valueAsNumber: true })}
                  error={form3.formState.errors.requestedAmount?.message}
                />
              </div>
              <div>
                <Label>Tenure (Months) *</Label>
                <Input
                  type="number"
                  min={1}
                  max={360}
                  placeholder="e.g. 12"
                  {...form3.register("tenure", { valueAsNumber: true })}
                  error={form3.formState.errors.tenure?.message}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Loan Purpose *</Label>
                <textarea
                  {...form3.register("purpose")}
                  placeholder="Describe the purpose of the loan in detail..."
                  rows={3}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-400 transition-colors resize-none"
                />
                {form3.formState.errors.purpose && (
                  <p className="mt-1 text-xs text-red-500">{form3.formState.errors.purpose.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Financial Information</h3>
            <p className="text-xs text-slate-500">Provide key financial data. Detailed analysis will be extracted from uploaded financial documents.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Annual Turnover (₹)", "FY 2024-25 revenue"],
                ["Net Profit (₹)", "FY 2024-25 net profit"],
                ["Total Assets (₹)", "As per latest balance sheet"],
                ["Total Liabilities (₹)", "As per latest balance sheet"],
                ["Existing Loan EMI (₹/month)", "Total existing EMI obligations"],
                ["Number of Employees", "Current headcount"],
              ].map(([label, placeholder]) => (
                <div key={label}>
                  <Label>{label}</Label>
                  <Input type="number" min={0} placeholder={placeholder} />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Collateral Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Collateral Type</Label>
                <Select>
                  <option value="">Select type</option>
                  {["Residential Property", "Commercial Property", "Industrial Property", "Agricultural Land", "Plant & Machinery", "Fixed Deposits"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Owner Name</Label>
                <Input placeholder="Property owner name" />
              </div>
              <div className="sm:col-span-2">
                <Label>Property Location</Label>
                <Input placeholder="Full address of the property" />
              </div>
              <div>
                <Label>Survey / Plot Number</Label>
                <Input placeholder="Survey or plot number" />
              </div>
              <div>
                <Label>Estimated Value (₹)</Label>
                <Input type="number" min={0} placeholder="Owner's estimated value" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Document Upload</h3>
            <p className="text-xs text-slate-500">Upload required documents. Documents will be processed for automatic extraction after submission.</p>
            {[
              { label: "KYC Documents", items: ["PAN Card (Applicant)", "Aadhaar Card", "Address Proof"] },
              { label: "Business Documents", items: ["GST Registration Certificate", "Incorporation / Partnership Deed", "MOA & AOA (if applicable)"] },
              { label: "Financial Documents", items: ["ITR — Last 2 Years", "Audited Balance Sheet — Last 2 Years", "Bank Statements — Last 12 Months"] },
              { label: "Collateral Documents", items: ["Title Deed / Sale Deed", "Property Tax Receipt"] },
            ].map((group) => (
              <div key={group.label} className="border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-700 mb-3">{group.label}</p>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-600">{item}</span>
                      </div>
                      <label className="cursor-pointer flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg transition-colors">
                        <Upload className="w-3 h-3" />
                        Upload
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-slate-900">Review & Submit</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-amber-800 mb-1">⚠ Before Submitting</p>
              <p className="text-xs text-amber-700">
                Please verify all information entered. Once submitted, the application will be assigned to a credit officer for review. You can still upload additional documents after submission.
              </p>
            </div>
            {[
              { label: "Applicant", data: form1.getValues() },
              { label: "Business", data: form2.getValues() },
              { label: "Loan Details", data: form3.getValues() },
            ].map((section) => (
              <div key={section.label} className="border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-700 mb-3">{section.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(section.data).map(([key, val]) => val && (
                    <div key={key}>
                      <p className="text-[10px] text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="text-xs font-medium text-slate-800">{String(val)}</p>
                    </div>
                  )) as React.ReactNode)}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="confirm-submit" className="w-4 h-4 accent-brand-600" />
              <label htmlFor="confirm-submit" className="text-xs text-slate-600">
                I confirm that all information provided is accurate to the best of my knowledge.
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs text-slate-400">Step {currentStep} of 7</span>
        {currentStep < 7 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Submit Application
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
