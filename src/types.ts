/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceItem {
  id: string;
  name: string;
  icon: string; // lucide icon name
  description: string;
  benefits: string[];
}

export interface PackageItem {
  id: string;
  name: string;
  price: string;
  term: string;
  popular: boolean;
  color: string; // e.g. "from-blue-500 to-indigo-500"
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: "Graphics" | "Social Media" | "Video" | "Print";
  image: string;
  description: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export interface InquiryForm {
  name: string;
  mobile: string;
  requirement: string;
  selectedPackage?: string;
}
