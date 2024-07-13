import CreateLink from "@/components/CreateLink";
import Error from "@/components/Error";
import LinkCard from "@/components/LinkCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/Context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrl";
import useFetch from "@/hooks/useFetch";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  const { loading, data: urls, error, fn: fnUrls } = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );
  //   console.log(urls, clicks);
  useEffect(() => {
    fnUrls();
  }, []);
  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  const filterUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  //   console.log(error);
  return (
    <div className="flex flex-col gap-8">
      {loading ||
        (loadingClicks && <BarLoader width={"100%"} color="#36d7b7" />)}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2" />
      </div>
      {error && <Error message={error.message} />}
      {(filterUrls || []).map((url, index) => (
        <LinkCard key={index} url={url} fetchUrls={fnUrls} />
      ))}
    </div>
  );
};

export default Dashboard;
