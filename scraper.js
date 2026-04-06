(async () => {
    console.log("%c🚀 Starting FreeDNS Scraper...", "color: cyan; font-weight: bold;");

    let allData = [];
    const pageText = document.body.innerText;
    const pageMatch = pageText.match(/Page \d+ of (\d+)/);
    const totalPages = pageMatch ? parseInt(pageMatch[1]) : 1;

    console.log(`Detected ${totalPages} pages.`);

    for (let i = 1; i <= totalPages; i++) {
        const url = `https://freedns.afraid.org/domain/registry/page-${i}.html`;
        
        try {
            const resp = await fetch(url);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const rows = doc.querySelectorAll('tr.trd, tr.trl');

            rows.forEach(row => {
                const cols = row.querySelectorAll('td');
                if (cols.length >= 4) {
                    const domainFullText = cols[0].innerText.trim();
                    const domain = domainFullText.split(/\s+/)[0]; // Get just the domain
                    
                    // Match the host count from text like "(123 hosts in use)"
                    const hostMatch = domainFullText.match(/\((\d+) hosts/);
                    const hosts = hostMatch ? hostMatch[1] : "0";

                    const status = cols[1].innerText.trim();
                    const ownerLink = cols[2].querySelector('a');
                    const owner = ownerLink ? ownerLink.innerText.trim() : cols[2].innerText.trim();
                    const ownerUrl = ownerLink ? `https://freedns.afraid.org${ownerLink.getAttribute('href')}` : "";
                    const age = cols[3].innerText.trim();

                    if (domain.includes('.')) {
                        allData.push({ domain, status, owner, ownerUrl, age, hosts });
                    }
                }
            });

            console.log(`Parsed Page ${i}/${totalPages} | Total so far: ${allData.size || allData.length}`);
            // Small delay to prevent being blocked
            await new Promise(r => setTimeout(r, 400));
        } catch (e) {
            console.error(`Error on page ${i}:`, e);
        }
    }

    // Sort Alphabetically
    allData.sort((a, b) => a.domain.toLowerCase().localeCompare(b.domain.toLowerCase()));

    // 1. Create Markdown List
    let markdown = "# FreeDNS Available Domains\n\n";
    markdown += "| Domain | Status | Owner | Age | Hosts |\n| :--- | :--- | :--- | :--- | :--- |\n";
    allData.forEach(item => {
        const ownerMd = item.ownerUrl ? `[${item.owner}](${item.ownerUrl})` : item.owner;
        markdown += `| **${item.domain}** | ${item.status} | ${ownerMd} | ${item.age} | ${item.hosts} |\n`;
    });

    // 2. Create TXT List (just the domains)
    const txtContent = allData.map(item => item.domain).join('\n');

    // Output Markdown to console for easy copy-paste
    console.log("%c--- MARKDOWN GENERATED ---", "color: lime;");
    console.log(markdown);

    // Trigger .txt file download
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'freedns_domains.txt';
    link.click();

    console.log("%c✅ Done! .txt file downloaded.", "color: lime; font-weight: bold;");
})();
