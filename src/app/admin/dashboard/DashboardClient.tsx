"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Activity, Clock, FileCheck, Mail, MessageCircle, 
  Send, CheckCircle, Clock4, User, Search, ChevronRight,
  Loader2, AlertCircle, Trash2, X, File, Download, Info, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

interface DashboardClientProps {
  initialData: any;
}

export function AdminDashboardClient({ initialData }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"metrics" | "messages">("metrics");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "success" | "error">("idle");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'contact' | 'conversion', title: string } | null>(null);
  const [showToast, setShowToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: "", type: 'success' });

  const { total, successRate, avgTimeSec, popular, recent, contacts } = initialData;

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: "", type: 'success' }), 3000);
  };

  const handleDelete = async (id: string, type: 'contact' | 'conversion') => {
    setIsDeleting(true);
    setDeleteStatus("idle");
    try {
      const res = await fetch(`/api/admin/${type}?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteStatus("success");
        triggerToast(`${type === 'contact' ? 'Message' : 'Record'} deleted successfully`, 'success');
        setTimeout(() => {
          setDeleteConfirm(null);
          if (type === 'contact') setSelectedContact(null);
          window.location.reload();
        }, 1000);
      } else {
        setDeleteStatus("error");
        triggerToast(`Failed to delete ${type}`, 'error');
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      setDeleteStatus("error");
      triggerToast(`Error deleting ${type}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedContact._id,
          replyMessage,
        }),
      });

      if (res.ok) {
        setStatus("success");
        triggerToast("Reply sent successfully", 'success');
        setReplyMessage("");
        setTimeout(() => {
          setSelectedContact(null);
          setStatus("idle");
          window.location.reload();
        }, 2000);
      } else {
        setStatus("error");
        triggerToast("Failed to send reply", 'error');
      }
    } catch (err) {
      setStatus("error");
      triggerToast("Error sending reply", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Admin Toast */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 z-[150] w-full max-w-xs px-4"
          >
            <div className={cn(
              "p-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md",
              showToast.type === 'success' ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"
            )}>
              {showToast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <p className="text-sm font-bold">{showToast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-card border shadow-2xl rounded-[2rem] p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black mb-2">Delete this {deleteConfirm.type === 'contact' ? 'message' : 'record'}?</h3>
              <p className="text-primary font-bold text-sm mb-4 line-clamp-1">"{deleteConfirm.title}"</p>
              <p className="text-muted-foreground text-xs mb-8 leading-relaxed">
                This action is permanent and cannot be undone.
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  variant="destructive" 
                  className="h-12 rounded-xl font-bold"
                  onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.type)}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Yes, Delete Now"}
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-12 rounded-xl font-bold"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Forge <span className="text-primary">Admin</span></h1>
          <p className="text-muted-foreground font-medium">Manage your platform and support your users.</p>
        </div>
        
        <div className="flex bg-muted p-1 rounded-2xl border shadow-sm">
          <button
            onClick={() => setActiveTab("metrics")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === "metrics" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart className="h-4 w-4" /> Metrics
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === "messages" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Mail className="h-4 w-4" /> Messages
            {contacts.filter((c: any) => c.status === "pending").length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "metrics" ? (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Orders", value: total, icon: BarChart, color: "text-blue-500" },
                { label: "Success Rate", value: `${successRate}%`, icon: Activity, color: "text-emerald-500" },
                { label: "Avg Latency", value: `${avgTimeSec}s`, icon: Clock, color: "text-purple-500" },
                { label: "Files Handled", value: total, icon: FileCheck, color: "text-orange-500" },
              ].map((stat, i) => (
                <Card key={i} className="border-2 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black">{stat.value.toLocaleString()}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 shadow-md border-2 overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest conversion requests across the platform</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {recent.map((req: any, i: number) => (
                      <div 
                        key={i} 
                        className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{req.originalFileName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">{req.conversionType}</p>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-4">
                          <div className="flex flex-col items-end gap-1">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                              req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                              req.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            )}>
                              {req.status}
                            </span>
                            <p suppressHydrationWarning className="text-[10px] text-muted-foreground font-medium">
                              {new Date(req.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
                            onClick={() => setDeleteConfirm({ id: req._id, type: 'conversion', title: req.originalFileName })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Types */}
              <Card className="shadow-md border-2">
                <CardHeader>
                  <CardTitle>Popular Types</CardTitle>
                  <CardDescription>Most requested forge modes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {popular.map((pop: any, i: number) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase">{pop._id}</span>
                          <span className="text-xs font-bold text-muted-foreground">{pop.count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(pop.count / total) * 100}%` }}
                            className="bg-primary h-full rounded-full" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
          >
            {/* Messages List */}
            <Card className={cn("lg:col-span-2 shadow-md border-2 overflow-hidden h-[700px] flex flex-col", selectedContact && "hidden lg:flex")}>
              <CardHeader className="bg-muted/30 border-b flex-shrink-0">
                <CardTitle>User Inquiries</CardTitle>
                <CardDescription>Messages from the contact form</CardDescription>
              </CardHeader>
              <div className="flex-1 overflow-y-auto divide-y">
                {contacts.length > 0 ? (
                  contacts.map((contact: any) => (
                    <div
                      key={contact._id}
                      className={cn(
                        "w-full text-left p-5 hover:bg-muted/10 transition-all group flex items-start gap-4 cursor-pointer",
                        selectedContact?._id === contact._id ? "bg-primary/5 border-l-4 border-primary" : "border-l-4 border-transparent"
                      )}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        contact.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"
                      )}>
                        {contact.status === "pending" ? <Clock4 className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-sm text-foreground truncate">{contact.name}</p>
                          <div className="flex items-center gap-3">
                            <span suppressHydrationWarning className="text-[10px] font-medium text-muted-foreground">{new Date(contact.createdAt).toLocaleDateString()}</span>
                            <button 
                              className="text-muted-foreground hover:text-red-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm({ id: contact._id, type: 'contact', title: `${contact.name}'s Message` });
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-primary mb-1 truncate">{contact.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{contact.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground">No messages yet.</div>
                )}
              </div>
            </Card>

            {/* Message Detail & Reply Form */}
            <div className="lg:col-span-3 space-y-6">
              {selectedContact ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="shadow-md border-2 overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b flex flex-row justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{selectedContact.name}</CardTitle>
                          <CardDescription className="font-medium text-primary">{selectedContact.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => setDeleteConfirm({ id: selectedContact._id, type: 'contact', title: `${selectedContact.name}'s Message` })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <button 
                          onClick={() => setSelectedContact(null)}
                          className="lg:hidden p-2 hover:bg-muted rounded-full"
                        >
                          <ChevronRight className="h-6 w-6 rotate-180" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject</span>
                        <h3 className="text-lg font-bold">{selectedContact.subject}</h3>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Message</span>
                        <div className="p-6 bg-muted/30 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedContact.message}
                        </div>
                      </div>

                      {selectedContact.status === "replied" && (
                        <div className="mt-8 pt-8 border-t space-y-4">
                          <div className="flex items-center gap-2 text-emerald-600">
                             <CheckCircle className="h-4 w-4" />
                             <span suppressHydrationWarning className="text-xs font-bold uppercase tracking-wider">Your Reply (Sent {new Date(selectedContact.repliedAt).toLocaleDateString()})</span>
                          </div>
                          <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900 text-sm leading-relaxed whitespace-pre-wrap italic">
                            {selectedContact.adminReply}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {selectedContact.status === "pending" && (
                    <Card className="shadow-xl border-2 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Send className="h-4 w-4 text-primary" /> Reply to {selectedContact.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleReply} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Your Message</label>
                            <textarea
                              required
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              className="w-full min-h-[150px] p-4 rounded-xl border-2 border-slate-100 bg-slate-50 dark:bg-slate-900/50 outline-none focus:border-primary transition-all text-sm"
                              placeholder={`Write your reply to ${selectedContact.name}...`}
                            />
                          </div>

                          {status === "success" && (
                            <div className="p-4 bg-emerald-100 text-emerald-700 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <CheckCircle className="h-4 w-4" /> Message sent successfully!
                            </div>
                          )}

                          {status === "error" && (
                            <div className="p-4 bg-red-100 text-red-700 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <AlertCircle className="h-4 w-4" /> Failed to send message.
                            </div>
                          )}

                          <Button 
                            disabled={isSubmitting || status === "success"}
                            className="w-full h-12 rounded-xl text-lg font-bold gap-3"
                          >
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            Send Reply
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ) : (
                <div className="h-[700px] flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-muted/50">
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border mb-6">
                    <MessageCircle className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No message selected</h3>
                  <p className="text-muted-foreground max-w-xs">Select a message from the list on the left to read and reply.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
