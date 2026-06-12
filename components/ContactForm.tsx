"use client";

import { useState } from "react";
import { companyInfo } from "@/lib/data";

const ContactForm = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const input =
        "w-full py-4 border-b border-line bg-transparent focus:border-safety focus:outline-none text-charcoal";

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <p className="text-charcoal">{companyInfo.headquarters}</p>
                    <p className="text-charcoal">{companyInfo.email}</p>
                    <p className="text-charcoal">{companyInfo.phone}</p>
                    <p className="text-sm text-muted">{companyInfo.legalName}</p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert("Thank you!");
                    }}
                    className="space-y-8"
                >
                    <input
                        type="text"
                        placeholder="Name *"
                        required
                        className={input}
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    />
                    <input
                        type="email"
                        placeholder="Email *"
                        required
                        className={input}
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                    <textarea
                        placeholder="Message *"
                        required
                        rows={5}
                        className={`${input} resize-none`}
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    />
                    <button
                        type="submit"
                        className="bg-safety text-white px-10 py-4 text-xs uppercase font-bold tracking-widest"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
