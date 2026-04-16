import React from 'react';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsView = () => {
  const { events, registrations } = useData();

  const eventStats = events.map(e => {
    const regs = registrations.filter(r => r.eventId === e.id);
    const present = regs.filter(r => r.attendance === 'present').length;
    const absent = regs.filter(r => r.attendance === 'absent').length;
    return { ...e, totalRegs: regs.length, present, absent, fillRate: e.capacity > 0 ? Math.round(regs.length / e.capacity * 100) : 0 };
  });

  const downloadCSV = () => {
    const headers = ['Event', 'Date', 'Venue', 'Capacity', 'Registrations', 'Present', 'Absent', 'Fill Rate'];
    const rows = eventStats.map(e => [e.title, e.date, e.venue, e.capacity, e.totalRegs, e.present, e.absent, `${e.fillRate}%`]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'campus_events_report.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Campus Events Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [['Event', 'Date', 'Venue', 'Capacity', 'Regs', 'Present', 'Absent', 'Fill %']],
      body: eventStats.map(e => [e.title, e.date, e.venue, e.capacity, e.totalRegs, e.present, e.absent, `${e.fillRate}%`]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [88, 64, 186] },
    });

    doc.save('campus_events_report.pdf');
    toast.success('PDF downloaded');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display">Reports</h2>
          <p className="text-muted-foreground">Event participation and attendance statistics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={downloadPDF} className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md">
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Events</p>
          <p className="text-3xl font-bold font-display">{events.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Registrations</p>
          <p className="text-3xl font-bold font-display">{registrations.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Overall Attendance</p>
          <p className="text-3xl font-bold font-display">{registrations.filter(r => r.attendance === 'present').length}</p>
        </motion.div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-sm font-medium p-4">Event</th>
                <th className="text-left text-sm font-medium p-4">Date</th>
                <th className="text-left text-sm font-medium p-4">Venue</th>
                <th className="text-center text-sm font-medium p-4">Capacity</th>
                <th className="text-center text-sm font-medium p-4">Registrations</th>
                <th className="text-center text-sm font-medium p-4">Present</th>
                <th className="text-center text-sm font-medium p-4">Absent</th>
                <th className="text-center text-sm font-medium p-4">Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              {eventStats.map((e, i) => (
                <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 text-sm font-medium">{e.title}</td>
                  <td className="p-4 text-sm text-muted-foreground">{e.date}</td>
                  <td className="p-4 text-sm text-muted-foreground">{e.venue}</td>
                  <td className="p-4 text-sm text-center">{e.capacity}</td>
                  <td className="p-4 text-sm text-center font-medium">{e.totalRegs}</td>
                  <td className="p-4 text-center"><span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">{e.present}</span></td>
                  <td className="p-4 text-center"><span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">{e.absent}</span></td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-border overflow-hidden">
                        <div className="h-full rounded-full gradient-primary" style={{ width: `${e.fillRate}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{e.fillRate}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {eventStats.length === 0 && <p className="text-sm text-muted-foreground text-center p-8">No data available</p>}
      </div>
    </div>
  );
};

export default ReportsView;
