"use client";

import { useState } from "react";
import EditHeader from "@/components/EditHeader";
import EditNavbar from "@/components/EditNavbar";
import EditSideBar from "@/components/EditSideBar";

export default function EditorActividadesLayout({ children }: { children: React.ReactNode;}) {
	const [activeNav, setActiveNav] = useState("objetivo");
	const [assistantOpen, setAssistantOpen] = useState(true);

	return (
		<div className="min-h-screen bg-[#F6F6F8] flex flex-col">
			<EditHeader />

			<div className="flex flex-1 min-h-0">
				<EditNavbar progress={0} activeNav={activeNav} setActiveNav={setActiveNav} />

				<main className="flex-1 min-w-0 overflow-y-auto">{children}</main>

				<EditSideBar
					assistantOpen={assistantOpen}
					setAssistantOpen={setAssistantOpen}
				/>
			</div>
		</div>
	);
}
