using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace HantaWorld.AdminApi.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(
            "Server=localhost;Database=hantaworld;User Id=hantaworld_user;Password=__SET_IN_PLESK__;TrustServerCertificate=True;MultipleActiveResultSets=True");

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
