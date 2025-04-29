import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Star, Paperclip, MoreHorizontal } from "lucide-react"
import Image from "next/image"

const messages = [
  {
    id: 1,
    sender: "John Doe",
    subject: "Project Update",
    preview: "Hi team, I wanted to share the latest...",
    time: "10:30 AM",
    unread: true,
    starred: false,
  },
  {
    id: 2,
    sender: "Jane Smith",
    subject: "Meeting Notes",
    preview: "Here are the notes from our meeting...",
    time: "Yesterday",
    unread: false,
    starred: true,
  },
  {
    id: 3,
    sender: "Mike Johnson",
    subject: "Question about Task",
    preview: "I have a quick question about...",
    time: "Jul 10",
    unread: true,
    starred: false,
  },
  {
    id: 4,
    sender: "Sarah Williams",
    subject: "New Design Mockups",
    preview: "I've attached the new design mockups...",
    time: "Jul 9",
    unread: false,
    starred: false,
  },
  {
    id: 5,
    sender: "Alex Brown",
    subject: "Feedback Request",
    preview: "Could you please provide feedback on...",
    time: "Jul 8",
    unread: false,
    starred: true,
  },
]

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]">Compose</Button>
      </div>

      <Tabs defaultValue="inbox" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="pl-9 w-[300px] focus-visible:ring-[#00B8D4]"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <TabsContent value="inbox" className="space-y-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-center space-x-4 p-4 hover:bg-gray-50 ${
                  index !== messages.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <Image src="/placeholder.svg" alt={message.sender} width={40} height={40} className="rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${message.unread ? "text-gray-900" : "text-gray-600"}`}>
                      {message.sender}
                    </p>
                    <div className="flex items-center">
                      {message.starred && <Star className="h-4 w-4 text-yellow-400 mr-2" />}
                      <p className="text-sm text-gray-500">{message.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-sm ${message.unread ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                      {message.subject}
                    </p>
                    {index === 3 && <Paperclip className="h-4 w-4 text-gray-400" />}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{message.preview}</p>
                </div>
                <div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sent">
          <div className="text-center py-10 text-gray-500">Sent messages will appear here.</div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="text-center py-10 text-gray-500">Draft messages will appear here.</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
