import React, { useState } from 'react';
import {
  Headphones,
  Send,
  MessageSquare,
  User,
  Shield,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../lib/auth';

interface Message {
  id: string;
  sender: 'clinician' | 'support';
  senderName: string;
  facility?: string;
  text: string;
  time: string;
}

export const Support: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'clinician',
      senderName: 'Dr. Joseph Mwamba',
      facility: 'Amana Regional Referral Hospital, Dar es Salaam',
      text: 'Habari HQ. I am in the pediatric ward and downloaded the Nia APK. Gemma model download paused at 64% over hospital cellular. Does it support resuming or should I retry on Wi-Fi?',
      time: '14:22',
    },
    {
      id: '2',
      sender: 'support',
      senderName: 'HQ Operator (ClerQ Support)',
      text: 'Habari Dr. Mwamba. Yes, the sequential downloader supports HTTP Range chunk resumption automatically! If you tap the Retry button in the Setup screen, it will pick up right where it left off without redownloading the first 64%.',
      time: '14:25',
    },
    {
      id: '3',
      sender: 'clinician',
      senderName: 'Dr. Joseph Mwamba',
      facility: 'Amana Regional Referral Hospital',
      text: 'Asante sana! Resumed seamlessly and verified the SHA256 checksum. Offline clerking is now running.',
      time: '14:28',
    },
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'support',
      senderName: user?.name || 'HQ Operator',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const quickReplies = [
    'Tap Retry on the Setup screen to resume your model download.',
    'Your clinical credentials have been verified by HQ.',
    'Offline mode is fully active. You do not require internet access for CDS rules.',
    'Please verify that your device has at least 800MB free storage for model weights.',
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Clinician Support & Assistance Desk
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time technical assistance, model installation guidance, and facility triage
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Chat Thread */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '620px', padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} style={{ color: 'var(--text-primary)' }} />
              </div>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Dr. Joseph Mwamba
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Amana Regional Referral Hospital • Pediatric Ward
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
              <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>Active Now</span>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((m) => {
              const isSupport = m.sender === 'support';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isSupport ? 'flex-end' : 'flex-start',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 4px' }}>
                    {m.senderName} • {m.time}
                  </span>
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSupport ? 'var(--text-primary)' : 'var(--bg-surface-elevated)',
                      color: isSupport ? 'var(--text-inverse)' : 'var(--text-primary)',
                      border: isSupport ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: '13px',
                      lineHeight: '1.5',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Replies Bar */}
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-elevated)', overflowX: 'auto', display: 'flex', gap: '8px', whiteSpace: 'nowrap' }}>
            {quickReplies.map((qr, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputText(qr)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Type clinical assistance message..."
              className="input-field"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 18px' }}>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Sidebar / Practitioner Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Practitioner Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CADRE</span>
                <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Medical Officer (Pediatrics)</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FACILITY REGISTRATION</span>
                <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Amana Regional Hospital</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CLIENT APP BUILD</span>
                <p style={{ fontWeight: 500, fontFamily: 'var(--font-mono)' }}>v1.36.0 (Build 1360)</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SECURITY VERIFICATION</span>
                <p style={{ fontWeight: 500, color: 'var(--success)' }}>Verified Practitioner</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Direct Emergency Hotline
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              For critical clinical CDS engine inquiries or medical emergencies in rural health centers, call HQ direct line:
            </p>
            <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              +255 754 000 000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
