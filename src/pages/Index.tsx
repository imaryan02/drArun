import React, { useState } from 'react';
import { Phone, Mail, MapPin, Download, Navigation, MessageCircle, Share2, Award, ChevronRight, Copy, Check, Globe, ChevronDown, ChevronUp, Building2, Clock, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ============= ALL DOCTOR DATA IN ONE PLACE =============
const doctor = {
  id: "dr-arun-kumar-gupta",

  personal: {
    fullName: "Dr. Arun Kumar Gupta",
    shortName: "Dr. Arun Gupta",
    title: "Consultant Rheumatologist & Clinical Immunologist",
    experience: "15+ Years Experience",
    tagline: "Enhancing Lives through Advanced Rheumatology Care",
    profileImage: "/images/dr-arun.png",
    initials: "AG",
  },

  registration: {
    authority: "NMC",
    number: "2757",
  },

  qualifications: {
    degrees: ["MBBS", "MD (Internal Medicine)"],
    fellowships: [
      "FACR – Fellow of American College of Rheumatology (USA)",
      "FAPLAR – Asia Pacific League of Associations for Rheumatology",
      "Fellowship in Rheumatology & Clinical Immunology – SGPGIMS, Lucknow (India)",
    ],
  },

  positions: [
    { role: "President", organization: "Norvic International Hospital" },
    { role: "Consultant Physician & Rheumatologist", organization: "Rheumatology & Arthritis Center" },
  ],

  specializations: [
    "Rheumatology",
    "Clinical Immunology",
    "Autoimmune Diseases",
    "Arthritis & Joint Disorders",
  ],

  contact: {
    phones: [
      { label: "Clinic", value: "+97714545877" },
      { label: "Mobile", value: "9813431616" },
    ],
    email: "drarun_2007@yahoo.com",
    website: "https://www.racnepal.com",
  },

  clinics: [
    {
      name: "Norvic International Hospital",
      role: "President",
      address: "Thapathali, Kathmandu, Nepal",
      timings: [{ days: "Monday – Friday", time: "9:00 AM – 5:00 PM" }],
      mapsQuery: "Norvic International Hospital Kathmandu",
    },
    {
      name: "Rheumatology & Arthritis Center",
      role: "Consultant Rheumatologist",
      address: "Naxal, Kathmandu, Nepal",
      timings: [{ days: "Sunday – Friday", time: "10:00 AM – 4:00 PM" }],
      mapsQuery: "Rheumatology and Arthritis Center Naxal Kathmandu",
    },
    {
      name: "Geeta Medicine",
      role: "Consultant",
      address: "Birgunj, Nepal",
      timings: [{ days: "Saturday", time: "Available" }],
      mapsQuery: "Geeta Medicine Birgunj",
    },
  ],

  social: {
    facebook: "https://facebook.com/dr-arun",
    instagram: "https://instagram.com/dr-arun",
    youtube: "https://youtube.com/@dr-arun",
    linkedin: "https://linkedin.com/in/dr-arun",
  },

  vcard: {
    fileName: "Dr_Arun_Kumar_Gupta.vcf",
    notes: [
      "Consultant Rheumatologist & Clinical Immunologist",
      "President – Norvic International Hospital",
      "NMC Registration No: 2757",
      "Specializations: Rheumatology, Clinical Immunology, Autoimmune Diseases",
      "Clinics:",
      "- Norvic International Hospital, Kathmandu",
      "- Rheumatology & Arthritis Center, Naxal, Kathmandu",
      "- Geeta Medicine, Birgunj (Saturday)",
      "Website: https://www.racnepal.com",
    ].join("\\n"),
  },
};

const VCard = () => {
  const [copied, setCopied] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [showClinics, setShowClinics] = useState(false);

  const handleSaveContact = async () => {
    try {
      toast.info("Generating contact card...");

      const vCardLines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${doctor.personal.fullName}`,
        `N:Gupta;Arun Kumar;;Dr.;`,
        `TITLE:${doctor.personal.title}`,
        `ORG:${doctor.positions[0].organization}`,
        ...doctor.contact.phones.map(p => `TEL;TYPE=${p.label.toUpperCase()}:${p.value}`),
        `EMAIL;TYPE=WORK:${doctor.contact.email}`,
        `URL:${doctor.contact.website}`,
        `ADR;TYPE=WORK:;;${doctor.clinics[0].name};${doctor.clinics[0].address};;;`,
        `NOTE:${doctor.vcard.notes}`,
        'END:VCARD'
      ];

      const vCardData = vCardLines.join('\n');
      const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doctor.vcard.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Contact saved! Open the file to add to contacts.");
    } catch (err) {
      toast.error("Failed to generate contact card");
      console.error(err);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello ${doctor.personal.shortName}, I would like to inquire about an appointment.`);
    const phone = doctor.contact.phones[1]?.value || doctor.contact.phones[0].value;
    window.open(`https://wa.me/${phone.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${doctor.contact.phones[0].value}`;
  };

  const handleDirections = (query?: string) => {
    const mapQuery = query || doctor.clinics[0].mapsQuery;
    window.open(`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`, '_blank');
  };

  const handleWebsite = () => {
    window.open(doctor.contact.website, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: doctor.personal.fullName,
      text: `${doctor.personal.fullName} - ${doctor.personal.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      copyToClipboard(window.location.href);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocial = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-vcard-background flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-vcard rounded-b-[60px] shadow-2xl z-0 transform -skew-y-3 origin-top-left scale-110" />
      <div className="absolute top-10 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-[80px] z-0 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-vcard-accent opacity-10 rounded-full blur-[100px] z-0" />

      <div className="w-full max-w-md px-4 pb-10 z-10 pt-8">
        {/* Main Glass Card */}
        <div className="bg-vcard-glass backdrop-blur-2xl rounded-[2.5rem] shadow-vcard overflow-hidden border border-white/60 animate-fade-in relative">
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-muted-foreground shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 border border-white"
            aria-label="Share Profile"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Profile Section */}
          <div className="relative pt-12 pb-6 flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-vcard-accent/20 to-transparent opacity-60" />

            <div className="relative w-40 h-40 mb-5 group">
              <div className="absolute inset-0 bg-gradient-vcard rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-40 h-40 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-white hover:scale-[1.02] transition-transform duration-500">
                <div className="w-full h-full bg-gradient-vcard flex items-center justify-center text-white text-4xl font-bold">
                  {doctor.personal.initials}
                </div>
              </div>
              {/* Online Indicator */}
              <div className="absolute bottom-2 right-2 bg-vcard-online w-7 h-7 rounded-full border-[3px] border-white shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full animate-ping bg-vcard-online opacity-75 absolute" />
                <div className="w-2 h-2 bg-white rounded-full relative z-10" />
              </div>
            </div>

            <div className="text-center px-6">
              <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">{doctor.personal.fullName}</h1>
              <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-vcard mb-2">{doctor.personal.title}</p>

              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-vcard-accent/10 border border-vcard-accent/20 backdrop-blur-sm rounded-full text-xs font-semibold text-vcard-accent shadow-sm">
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  {doctor.personal.experience}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-vcard-secondary/10 border border-vcard-secondary/20 backdrop-blur-sm rounded-full text-xs font-semibold text-vcard-secondary shadow-sm">
                  {doctor.registration.authority}: {doctor.registration.number}
                </span>
              </div>

              {/* Current Position Badge */}
              <div className="mb-5 px-4 py-2 bg-gradient-to-r from-vcard-accent/10 to-vcard-secondary/10 rounded-xl border border-vcard-accent/20">
                <p className="text-xs font-bold text-vcard-accent">{doctor.positions[0].role}</p>
                <p className="text-xs text-muted-foreground">{doctor.positions[0].organization}</p>
              </div>

              {/* Collapsible Credentials */}
              <div className="w-full mb-6">
                <button
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/50 hover:bg-muted/80 rounded-xl border border-border/60 transition-all duration-300 group"
                >
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">View Qualifications & Fellowships</span>
                  {showCredentials ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showCredentials ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                  <div className="bg-white/60 p-4 rounded-xl border border-border text-left space-y-3 text-sm text-muted-foreground shadow-inner">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-1">Degrees</p>
                      <p className="font-medium text-foreground">{doctor.qualifications.degrees.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-1">Fellowships</p>
                      <ul className="space-y-1">
                        {doctor.qualifications.fellowships.map((f, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-vcard-accent rounded-full mt-1.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="px-6 pb-8">
            <Button
              onClick={handleSaveContact}
              className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl rounded-2xl mb-6 active:scale-[0.98]"
              variant="vcard"
            >
              <Download className="mr-2.5 h-6 w-6" />
              Save to Contacts
            </Button>

            <div className="grid grid-cols-4 gap-3 mb-8">
              <button
                onClick={handleCall}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-vcard-accent/10 to-white text-vcard-accent hover:from-vcard-accent/20 hover:to-vcard-accent/5 transition-all duration-300 border border-vcard-accent/20 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300 border border-vcard-accent/10">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold tracking-tight">Call</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-vcard-online/10 to-white text-vcard-online hover:from-vcard-online/20 hover:to-vcard-online/5 transition-all duration-300 border border-vcard-online/20 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300 border border-vcard-online/10">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
              </button>

              <button
                onClick={() => handleDirections()}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-vcard-secondary/10 to-white text-vcard-secondary hover:from-vcard-secondary/20 hover:to-vcard-secondary/5 transition-all duration-300 border border-vcard-secondary/20 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300 border border-vcard-secondary/10">
                  <Navigation className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold tracking-tight">Map</span>
              </button>

              <button
                onClick={handleWebsite}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-vcard-teal/10 to-white text-vcard-teal hover:from-vcard-teal/20 hover:to-vcard-teal/5 transition-all duration-300 border border-vcard-teal/20 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300 border border-vcard-teal/10">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold tracking-tight">Website</span>
              </button>
            </div>

            {/* Specializations */}
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-3 ml-1 flex items-center">
                  Specializations
                  <span className="ml-2 h-px w-full bg-border" />
                </h3>
                <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                  {doctor.specializations.map((spec, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-border rounded-xl text-sm font-semibold text-foreground whitespace-nowrap shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinics Collapsible */}
              <div>
                <button
                  onClick={() => setShowClinics(!showClinics)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-vcard-accent/5 to-vcard-secondary/5 hover:from-vcard-accent/10 hover:to-vcard-secondary/10 rounded-xl border border-border/60 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-vcard-accent" />
                    <span className="text-sm font-semibold text-foreground">Visiting Clinics ({doctor.clinics.length})</span>
                  </div>
                  {showClinics ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showClinics ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
                  <div className="space-y-3">
                    {doctor.clinics.map((clinic, index) => (
                      <div key={index} className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-foreground text-sm">{clinic.name}</p>
                            <p className="text-xs text-vcard-accent font-medium">{clinic.role}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDirections(clinic.mapsQuery)} 
                            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-vcard-secondary hover:bg-vcard-secondary/10 rounded-full"
                          >
                            <Navigation className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {clinic.address}
                        </div>
                        {clinic.timings.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {t.days}: {t.time}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm flex items-center justify-between group hover:bg-white/80 transition-all duration-300">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 rounded-full bg-vcard-accent/10 flex items-center justify-center text-vcard-accent shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-wider">Phone Numbers</p>
                      {doctor.contact.phones.map((p, i) => (
                        <p key={i} className="text-sm font-bold text-foreground">{p.label}: {p.value}</p>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCall} className="shrink-0 h-10 w-10 text-muted-foreground hover:text-vcard-accent hover:bg-vcard-accent/10 rounded-full">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm flex items-center justify-between group hover:bg-white/80 transition-all duration-300">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 rounded-full bg-vcard-secondary/10 flex items-center justify-center text-vcard-secondary shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-bold text-foreground truncate">{doctor.contact.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(doctor.contact.email)} className="shrink-0 h-10 w-10 text-muted-foreground hover:text-vcard-secondary hover:bg-vcard-secondary/10 rounded-full">
                    {copied ? <Check className="w-5 h-5 text-vcard-online" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-3 ml-1 flex items-center">
                  Connect
                  <span className="ml-2 h-px w-full bg-border" />
                </h3>
                <div className="flex justify-center gap-3">
                  <button onClick={() => handleSocial(doctor.social.facebook)} className="w-11 h-11 rounded-full bg-white/80 border border-border flex items-center justify-center text-muted-foreground hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-all duration-300 hover:scale-110">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleSocial(doctor.social.instagram)} className="w-11 h-11 rounded-full bg-white/80 border border-border flex items-center justify-center text-muted-foreground hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30 transition-all duration-300 hover:scale-110">
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleSocial(doctor.social.youtube)} className="w-11 h-11 rounded-full bg-white/80 border border-border flex items-center justify-center text-muted-foreground hover:text-[#FF0000] hover:bg-[#FF0000]/10 hover:border-[#FF0000]/30 transition-all duration-300 hover:scale-110">
                    <Youtube className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleSocial(doctor.social.linkedin)} className="w-11 h-11 rounded-full bg-white/80 border border-border flex items-center justify-center text-muted-foreground hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 transition-all duration-300 hover:scale-110">
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted/30 backdrop-blur-sm px-6 py-5 flex items-center justify-center border-t border-border">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold text-center">
              {doctor.personal.tagline}
            </p>
          </div>
        </div>

        {/* Bottom Logo */}
        <div className="text-center mt-8 pb-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
          <p className="text-xs text-muted-foreground font-semibold tracking-wider">Digital VCard</p>
        </div>
      </div>
    </div>
  );
};

export default VCard;
