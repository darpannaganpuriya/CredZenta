import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertTriangle, Clock, X, ExternalLink, Info } from "lucide-react";
import type { ApplicationDetails, Document, DocumentCategory } from "../../types";
import { formatDate, cn } from "../../lib/utils";

interface DocumentsTabProps {
  app: ApplicationDetails;
}

const STATUS_CONFIG = {
  Uploaded: { label: "Uploaded", className: "bg-slate-100 text-slate-600" },
  Processing: { label: "Processing", className: "bg-blue-50 text-blue-600" },
  Extracted: { label: "Extracted", className: "bg-indigo-50 text-indigo-600" },
  Verified: { label: "Verified", className: "bg-emerald-50 text-emerald-600" },
  "Review Required": { label: "Review Required", className: "bg-amber-50 text-amber-700" },
};

const CATEGORIES: DocumentCategory[] = [
  "KYC", "GST", "ITR", "Bank Statements", "Financial Statements",
  "Business Documents", "Collateral", "Legal", "Other",
];

function DocStatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Uploaded;
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded text-[10px] font-medium", config.className)}>
      {config.label}
    </span>
  );
}

function DocumentPreviewDrawer({
  doc,
  onClose,
}: { doc: Document; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div className="min-w-0 pr-4">
            <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{doc.category} · {doc.fileType} · {doc.fileSize}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mock document preview */}
        <div className="flex-shrink-0 bg-slate-100 mx-5 mt-4 rounded-lg h-44 flex items-center justify-center border-2 border-dashed border-slate-300">
          <div className="text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Document Preview</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Demo — Preview not available</p>
          </div>
        </div>

        {/* Extracted fields */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">Extracted Information</h4>
            {doc.confidenceScore > 0 && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {doc.confidenceScore}% Confidence
              </span>
            )}
          </div>

          {doc.extractedFields.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p className="text-xs">Extraction pending</p>
            </div>
          ) : (
            <div className="space-y-2">
              {doc.extractedFields.map((field) => (
                <div key={field.label} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{field.label}</p>
                    <span className="text-[10px] text-slate-400">{field.confidence}%</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{field.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Source: {field.source}</p>
                </div>
              ))}
            </div>
          )}

          {doc.reviewNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-800">Review Note</p>
                  <p className="text-xs text-amber-700 mt-0.5">{doc.reviewNote}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statuses */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] font-medium text-slate-500 mb-1">Processing</p>
              <DocStatusBadge status={doc.processingStatus} />
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] font-medium text-slate-500 mb-1">Verification</p>
              <DocStatusBadge status={doc.verificationStatus} />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Uploaded {formatDate(doc.uploadedAt)} by {doc.uploadedBy}
          </p>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-2">
          <button className="flex-1 text-xs text-slate-600 border border-slate-200 rounded-lg py-2 hover:bg-slate-50 flex items-center justify-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" />
            View Full Document
          </button>
          <button className="flex-1 text-xs bg-brand-600 text-white rounded-lg py-2 hover:bg-brand-700 transition-colors">
            Mark as Verified
          </button>
        </div>
      </div>
    </div>
  );
}

export function DocumentsTab({ app }: DocumentsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const categories = ["All", ...CATEGORIES.filter((c) =>
    app.documents.some((d) => d.category === c)
  )];

  const filtered = selectedCategory === "All"
    ? app.documents
    : app.documents.filter((d) => d.category === selectedCategory);

  const verifiedCount = app.documents.filter((d) => d.verificationStatus === "Verified").length;
  const reviewRequired = app.documents.filter((d) => d.verificationStatus === "Review Required").length;

  return (
    <div className="space-y-4 tab-content">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Documents", value: app.documents.length, color: "text-slate-900" },
          { label: "Verified", value: verifiedCount, color: "text-emerald-600" },
          { label: "Review Required", value: reviewRequired, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="section-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category filter + Upload */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                selectedCategory === cat
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-brand-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-medium">
          <Upload className="w-3.5 h-3.5" />
          Upload Document
          <input type="file" className="hidden" />
        </label>
      </div>

      {/* Document list */}
      <div className="section-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Category</th>
              <th>Uploaded</th>
              <th>Processing</th>
              <th>Verification</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc.id} onClick={() => setSelectedDoc(doc)}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate max-w-[200px]">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">{doc.fileType} · {doc.fileSize}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-xs text-slate-600">{doc.category}</span>
                </td>
                <td className="text-xs text-slate-500 whitespace-nowrap">{formatDate(doc.uploadedAt)}</td>
                <td><DocStatusBadge status={doc.processingStatus} /></td>
                <td>
                  <div className="flex items-center gap-1.5">
                    {doc.verificationStatus === "Verified" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    {doc.verificationStatus === "Review Required" && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <DocStatusBadge status={doc.verificationStatus} />
                  </div>
                </td>
                <td>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap"
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDoc && (
        <DocumentPreviewDrawer doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
}
