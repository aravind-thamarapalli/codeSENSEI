
'use client';

import type { AnalysisResults } from '@/app/actions';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Archive, FileText, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export type HistoryItem = {
    id: string;
    code: string;
    summary: string;
    results: AnalysisResults;
    timestamp: number;
    conversation?: { question: string, answer: string }[];
}

interface HistorySidebarProps {
    history: HistoryItem[];
    onSelectHistory: (item: HistoryItem) => void;
    onClearHistory: () => void;
    activeItemId: string | null;
}

export function HistorySidebar({ history, onSelectHistory, onClearHistory, activeItemId }: HistorySidebarProps) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 overflow-hidden group-data-[state=collapsed]:hidden">
                        <Archive className="w-5 h-5" />
                        <h2 className="text-lg font-semibold whitespace-nowrap">History</h2>
                    </div>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent className="p-2">
                {history.length > 0 ? (
                    <SidebarMenu>
                        {history.map((item) => (
                             <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton 
                                    onClick={() => onSelectHistory(item)} 
                                    isActive={item.id === activeItemId}
                                    tooltip={{
                                        children: (
                                            <>
                                                <p className="font-medium">{item.summary || "Code Snippet"}</p>
                                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                            </>
                                        ),
                                        side: "right",
                                        align: "start"
                                    }}
                                >
                                    <FileText />
                                    <span>{item.summary || "Code Snippet"}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                ) : (
                    <div className="text-center text-sm text-muted-foreground p-4 mt-4">
                        Your analysis history will appear here.
                    </div>
                )}
            </SidebarContent>
            {history.length > 0 && (
                <>
                    <SidebarSeparator />
                    <SidebarFooter>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10 group-data-[state=collapsed]:justify-center" onClick={onClearHistory}>
                            <Trash2 className="mr-2 h-4 w-4 group-data-[state=collapsed]:mr-0" />
                            <span className="group-data-[state=collapsed]:hidden">Clear History</span>
                        </Button>
                    </SidebarFooter>
                </>
            )}
        </Sidebar>
    );
}
