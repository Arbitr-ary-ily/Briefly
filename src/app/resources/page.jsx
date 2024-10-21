"use client"

import { useState } from 'react'
import { Search, ChevronRight, ChevronLeft } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'
const categories = [
  "News Sources",
  "Fact-Checking",
  "Data Journalism",
  "Investigative Tools",
  "Media Ethics",
  "Digital Security",
  "Multimedia",
  "Press Freedom"
]

const resources = [
  {
    category: "News Sources",
    items: [
      { title: "BBC News", description: "Impartial, global news coverage", link: "https://www.bbc.com/news" },
      { title: "Reuters", description: "International news organization", link: "https://www.reuters.com/" },
      { title: "Associated Press", description: "Independent news cooperative", link: "https://apnews.com/" },
      { title: "The New York Times", description: "Award-winning journalism", link: "https://www.nytimes.com/" },
      { title: "Al Jazeera", description: "Middle East-based global news", link: "https://www.aljazeera.com/" },
      { title: "The Guardian", description: "British daily newspaper", link: "https://www.theguardian.com/" },
      { title: "NPR", description: "National Public Radio, providing news and cultural programming", link: "https://www.npr.org/" },
      { title: "The Washington Post", description: "Leading American news source known for political reporting", link: "https://www.washingtonpost.com/" },
    ]
  },
  {
    category: "Fact-Checking",
    items: [
      { title: "Snopes", description: "Oldest and largest fact-checking site", link: "https://www.snopes.com/" },
      { title: "PolitiFact", description: "Fact-checking U.S. politics", link: "https://www.politifact.com/" },
      { title: "FactCheck.org", description: "Nonpartisan fact-checking", link: "https://www.factcheck.org/" },
      { title: "Full Fact", description: "UK's independent fact-checking charity", link: "https://fullfact.org/" },
      { title: "Check Your Fact", description: "Fact-checking service for various claims", link: "https://checkyourfact.com/" },
    ]
  },
  {
    category: "Data Journalism",
    items: [
      { title: "DataJournalism.com", description: "Resources for data journalists", link: "https://datajournalism.com/" },
      { title: "Google Public Data Explorer", description: "Explore public datasets", link: "https://www.google.com/publicdata/directory" },
      { title: "Data.gov", description: "U.S. government's open data", link: "https://data.gov/" },
      { title: "Our World in Data", description: "Research and data on global issues", link: "https://ourworldindata.org/" },
      { title: "The Pudding", description: "Visual essays that explain complex topics", link: "https://pudding.cool/" },
    ]
  },
  {
    category: "Investigative Tools",
    items: [
      { title: "OCCRP Aleph", description: "Global archive of research material", link: "https://aleph.occrp.org/" },
      { title: "DocumentCloud", description: "Document analysis platform", link: "https://www.documentcloud.org/" },
      { title: "Global Investigative Journalism Network", description: "Resources for investigative journalists", link: "https://gijn.org/" },
      { title: "Bellingcat's Online Investigation Toolkit", description: "Open-source investigation tools", link: "https://docs.google.com/document/d/1BfLPJpRtyq4RFtHJoNpvWQjmGnyVkfE2HYoICKOGguA/edit" },
      { title: "ProPublica", description: "Nonprofit newsroom that produces investigative journalism", link: "https://www.propublica.org/" },
    ]
  },
  {
    category: "Media Ethics",
    items: [
      { title: "Society of Professional Journalists Code of Ethics", description: "Ethical journalism guidelines", link: "https://www.spj.org/ethicscode.asp" },
      { title: "Ethical Journalism Network", description: "Promoting ethical journalism worldwide", link: "https://ethicaljournalismnetwork.org/" },
      { title: "Poynter Institute", description: "Journalism education and strategies", link: "https://www.poynter.org/" },
      { title: "International Press Institute", description: "Global network for press freedom and media development", link: "https://ipi.media/" },
    ]
  },
  {
    category: "Digital Security",
    items: [
      { title: "Digital Security Lab", description: "Security resources for journalists", link: "https://www.digitalsecuritylab.org/" },
      { title: "Security Planner", description: "Customized online safety recommendations", link: "https://securityplanner.org/" },
      { title: "Freedom of the Press Foundation", description: "Digital security for journalists", link: "https://freedom.press/" },
      { title: "Access Now", description: "Digital security and privacy advocacy", link: "https://www.accessnow.org/" },
    ]
  },
  {
    category: "Multimedia",
    items: [
      { title: "Canva", description: "Graphic design platform", link: "https://www.canva.com/" },
      { title: "Datawrapper", description: "Create charts and maps", link: "https://www.datawrapper.de/" },
      { title: "Audacity", description: "Audio editing software", link: "https://www.audacityteam.org/" },
      { title: "DaVinci Resolve", description: "Video editing software", link: "https://www.blackmagicdesign.com/products/davinciresolve/" },
      { title: "Adobe Spark", description: "Create graphics, web pages, and video stories", link: "https://spark.adobe.com/" },
    ]
  },
  {
    category: "Press Freedom",
    items: [
      { title: "Reporters Without Borders", description: "Defending press freedom worldwide", link: "https://rsf.org/en" },
      { title: "Committee to Protect Journalists", description: "Promoting press freedom worldwide", link: "https://cpj.org/" },
      { title: "Article 19", description: "Freedom of expression organization", link: "https://www.article19.org/" },
      { title: "Index on Censorship", description: "Campaigning for freedom of expression worldwide", link: "https://www.indexoncensorship.org/" },
    ]
  },
]

const journalismMilestones = [
  { year: 1605, event: "The first printed weekly newspaper was published in Strasbourg." },
  { year: 1690, event: "America saw the launch of its first newspaper." },
  { year: 1785, event: "The Times began its operations in London." },
  { year: 1851, event: "The New York Times was established, marking a significant development in journalism." },
  { year: 1896, event: "The era of yellow journalism commenced with the competition between Hearst and Pulitzer." },
  { year: 1922, event: "The BBC was founded, marking the beginning of broadcast journalism." },
  { year: 1971, event: "The release of the Pentagon Papers had a notable impact on press freedom." },
  { year: 1980, event: "CNN was introduced, leading to continuous news coverage." },
  { year: 1989, event: "Tim Berners-Lee created the World Wide Web, facilitating information sharing." },
  { year: 1995, event: "The Drudge Report was launched, influencing online news aggregation." },
  { year: 2006, event: "WikiLeaks emerged, significantly impacting investigative journalism." },
  { year: 2006, event: "Twitter was launched, becoming an important platform for real-time news." },
  { year: 2013, event: "Edward Snowden's leaks highlighted the importance of digital security." },
  { year: 2018, event: "The Time's Up movement raised awareness about #MeToo reporting." },
  { year: 2021, event: "There was a growing emphasis on combating misinformation in the digital age." }
]

export default function ConsolidatedNewsResources() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(categories[0])
  const [selectedMilestone, setSelectedMilestone] = useState(journalismMilestones[journalismMilestones.length - 1])

  const filteredResources = resources.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Image src="/logo.svg" alt="Logo" width={275} height={100} />
        <h1 className="text-5xl font-bold mb-6 mt-6">News and Journalism Resources</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-10 pr-4 py-2 w-full border focus:border-gray-500 focus:ring-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center mb-10">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveTab(category)}
                className={`px-4 ${activeTab === category ? 'bg-gray-200' : 'bg-transparent'}`}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(searchTerm ? filteredResources : resources)
                  .find(r => r.category === category)?.items.map((item, index) => (
                    <Card key={index} className="border-gray-200 hover:border-gray-300 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-yellow-400">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full border-gray-300">
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            Visit Resource <ChevronRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mb-12 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Interactive Journalism Timeline</h2>
          <Card className="border-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const currentIndex = journalismMilestones.findIndex(m => m.year === selectedMilestone.year);
                    if (currentIndex > 0) {
                      setSelectedMilestone(journalismMilestones[currentIndex - 1]);
                    }
                  }}
                  disabled={selectedMilestone.year === journalismMilestones[0].year}
                  className="border-gray-300"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <h3 className="text-xl font-semibold">{selectedMilestone.year}</h3>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const currentIndex = journalismMilestones.findIndex(m => m.year === selectedMilestone.year);
                    if (currentIndex < journalismMilestones.length - 1) {
                      setSelectedMilestone(journalismMilestones[currentIndex + 1]);
                    }
                  }}
                  disabled={selectedMilestone.year === journalismMilestones[journalismMilestones.length - 1].year}
                  className="border-gray-300"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-center">{selectedMilestone.event}</p>
            </CardContent>
          </Card>
          <ScrollArea className="h-20 mt-4">
            <div className="flex space-x-2">
              {journalismMilestones.map((milestone, index) => (
                <Button
                  key={index}
                  variant={milestone.year === selectedMilestone.year ? "default" : "outline"}
                  onClick={() => setSelectedMilestone(milestone)}
                  className={`flex-shrink-0 ${
                    milestone.year === selectedMilestone.year 
                      ? 'bg-yellow-400 text-white hover:bg-yellow-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {milestone.year}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
