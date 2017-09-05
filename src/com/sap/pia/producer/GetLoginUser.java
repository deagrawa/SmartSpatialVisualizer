package com.sap.pia.producer;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.sap.security.um.user.PersistenceException;
import com.sap.security.um.user.User;
import com.sap.security.um.user.UserProvider;

public class GetLoginUser
{

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(GetLoginUser.class);
	private User user;

	/**
	 * GetLoginUser method used to get login user using SSO authentication.
	 * 
	 * @param request
	 *            HttpServletRequest object
	 * @param queryInfo
	 *            Condition clause
	 * @return
	 *			  Return user value for SSO authenticate user.
	 */
	GetLoginUser(HttpServletRequest request) throws NamingException
	{
		// SSO Authentication Step
		InitialContext ctx= new InitialContext();
		UserProvider userProvider= (UserProvider)ctx.lookup(OdataUtility.getPropertiesMap().get("userProviderPath"));

		if(request.getUserPrincipal() != null && userProvider != null)
		{
			try
			{
				user= userProvider.getUser(request.getUserPrincipal().getName());
			}
			catch(PersistenceException e)
			{
				LOGGER.error(OdataUtility.getStackTrace(e));
			}
		}
		else
		{

			LOGGER.error("GetAppData: Application user is null :");
		}
	}

	public String doGetUserName()
	{
		String userName= "";
		if(null != user && null != user.getName())
			userName= user.getName();
		return userName;
	}
	
	public boolean hasDefinedRole()
	{
		boolean hasRole= false;
		if(null != user && null != user.getName())
			hasRole= user.hasRole("UT_REG");
		return hasRole;
	}
}
