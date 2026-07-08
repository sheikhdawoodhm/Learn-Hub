import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Award, Download, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import API from "../api/axiosAPI";

const CertificatePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [issuedAt, setIssuedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const course = useSelector((state: any) =>
    state.courses?.courses?.find((c: any) => String(c.id) === String(courseId))
  );
  const courseTitle = course?.title || "Course";
  const completedDate = issuedAt
    ? new Date(issuedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "";

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char] || char));

  const handleDownload = () => {
    const certificateHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Certificate - ${escapeHtml(courseTitle)}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f8fafc; font-family: Georgia, serif; }
    .certificate { width: 1000px; aspect-ratio: 1.414; border: 16px double #312e81; background: white; padding: 64px; box-sizing: border-box; text-align: center; color: #1e293b; }
    h1 { font-size: 52px; text-transform: uppercase; margin: 24px 0; }
    h2 { font-size: 42px; border-bottom: 2px solid #e2e8f0; display: inline-block; padding: 0 48px 12px; }
    h3 { font-size: 32px; color: #4338ca; }
    .footer { display: flex; justify-content: space-between; margin-top: 80px; font-family: Arial, sans-serif; }
    .line { border-top: 1px solid #64748b; width: 220px; padding-top: 8px; }
  </style>
</head>
<body>
  <main class="certificate">
    <h1>Certificate of Completion</h1>
    <p>This is to certify that</p>
    <h2>${escapeHtml(user?.name || "Student")}</h2>
    <p>has successfully completed the course</p>
    <h3>${escapeHtml(courseTitle)}</h3>
    <div class="footer">
      <div class="line">Date Completed<br />${escapeHtml(completedDate)}</div>
      <div>Learn-Hub<br />Authorized Issuer</div>
    </div>
  </main>
</body>
</html>`;

    const blob = new Blob([certificateHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${courseTitle.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-certificate.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/certificates/course/${courseId}`);
        if (res.data.success && res.data.data) {
          setIssuedAt(res.data.data.issued_at);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          try {
            const genRes = await API.post(`/certificates/course/${courseId}`);
            setIssuedAt(genRes.data.data.issued_at);
            setError("");
          } catch (generateErr: any) {
            setError(generateErr.response?.data?.error || "Failed to generate certificate. Ensure you have completed the course.");
          }
          return;
        }

        setError(err.response?.data?.error || "Failed to load certificate. Ensure you have completed the course.");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [courseId, course]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <p className="text-rose-500 mb-4 font-semibold text-lg">{error}</p>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="text-indigo-600 font-bold flex items-center gap-1 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between mb-6">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4" /> Download Certificate
        </button>
      </div>

      <div id="certificate" className="w-full max-w-4xl bg-white aspect-[1.414] border-[16px] border-double border-indigo-900 rounded-lg shadow-2xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50 rounded-br-full opacity-50" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50 rounded-tl-full opacity-50" />
        
        <Award className="w-24 h-24 text-indigo-600 mb-8" />
        
        <h1 className="text-5xl font-serif font-bold text-slate-800 mb-4 tracking-wide uppercase">
          Certificate of Completion
        </h1>
        
        <p className="text-lg text-slate-500 mb-8 italic">This is to certify that</p>
        
        <h2 className="text-4xl font-semibold text-slate-900 mb-8 border-b-2 border-slate-200 pb-2 px-12 inline-block">
          {user?.name || "Student"}
        </h2>
        
        <p className="text-lg text-slate-500 mb-4">has successfully completed the course</p>
        
        <h3 className="text-3xl font-bold text-indigo-700 mb-12 max-w-2xl">
          {courseTitle}
        </h3>
        
        <div className="flex w-full justify-between items-end mt-auto px-12">
          <div className="text-left border-t border-slate-400 pt-2 w-48">
            <p className="text-sm font-semibold text-slate-700">Date Completed</p>
            <p className="text-sm text-slate-500">
              {completedDate}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center border-2 border-indigo-200 shadow-inner mb-4 mx-auto">
              <Award className="w-12 h-12 text-indigo-400" />
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Learn-Hub</p>
          </div>

          <div className="text-right border-t border-slate-400 pt-2 w-48">
            <p className="text-sm font-semibold text-slate-700">Learn-Hub Platform</p>
            <p className="text-sm text-slate-500">Authorized Issuer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
