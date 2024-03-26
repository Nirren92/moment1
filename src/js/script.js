document.addEventListener('DOMContentLoaded',init());


async function init()
{
try
{
    let courses = await get_data("https://moment1.onrender.com/api/courses");
    console.log("Kurser är:",courses);
}
catch(error)
{
    console.error('nåt gick fel',error);
}
}




async function get_data(url_IN)
{
        const response = await fetch(url_IN);
        const data = await response.json();
        return data;
}




